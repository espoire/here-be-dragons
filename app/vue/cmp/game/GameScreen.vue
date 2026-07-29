<script setup>
import { reactive, ref, shallowRef } from 'vue';
import Node from '/app/game/Node.js';
import { randomArraySampleWithoutReplacement } from '/app/util/random.js';
import OvernightUI from './OvernightUI.vue';
import ConstructionUI from './ConstructionUI.vue';
import Guild from '/app/game/Guild.js';
import { deepClone } from '/app/util/object.js';
import Constants from '/app/Constants.js';

// const props = defineProps({
//   // settings: {
//   //   type: Object,
//   //   required: true,
//   // },
// });

const map = [];
const nodes = [];
const radius = 5;
const coordinateOffset = { x: radius, y: radius };

function initMap() {
  for (let row = 0; row < 2 * radius + 1; row++) {
    const rowWidth = 2 * radius + 1 - Math.abs(radius - row);
    const rowOffset = Math.max(0, radius - row);
    map.push([]);
  
    for (let col = rowOffset; col < rowOffset + rowWidth; col++) {
      const x = col - coordinateOffset.x;
      const y = row - coordinateOffset.y;
      
      const node = new Node(x, y);
  
      nodes.push(node);
      map[row][col] = node;
    }
  }
}

initMap();

function ageMap(days = 1) {
  for (const node of nodes) node.age(days);
}

const locX = ref(0);
const locY = ref(0);

const resources = reactive({});
const resourcesToday = reactive({});

function onClickNode(x, y) {
  if (stamina.value <= 0) return; // Can't move if out of stamina

  moveToNode(x, y);
  endOfDayMaybe();
}

function moveToNode(x, y) {
  // Update position
  locX.value = x;
  locY.value = y;

  // Spend stamina
  stamina.value -= 1;
  
  // If node is fresh (not visited), collect resources if applicable
  const node = map[locY.value + coordinateOffset.y][locX.value + coordinateOffset.x];
  collectResource(node);
  
  // Mark node as visited
  if (!node.visited) daySummary.nodesVisited = (daySummary.nodesVisited ?? 0) + 1;
  node.visited = true;
}

function collectResource(node) {
  if (node && !node.visited) {
    const resource = node.type.resource;
    if (resource) {
      eventText.value = `+1 ${resource}!`;
      resources[resource] = (resources[resource] ?? 0) + 1;
      resourcesToday[resource] = (resourcesToday[resource] ?? 0) + 1;
    }
  }
}

const background = ref('day');

function endOfDayMaybe() {
  const node = map[locY.value + coordinateOffset.y][locX.value + coordinateOffset.x];
  const returnedHome = (node.type.id === 'hub');
  const endOfDay = (returnedHome || stamina.value <= 0);
  if (!endOfDay) return;

  background.value = 'night';
  returnedHomeMaybe(returnedHome);
  prepOvernightUI();
}

function returnedHomeMaybe(returnedHome) {
  if (!returnedHome) {
    eventText.value = 'Out of stamina! Returning home...';
    return;
  }

  daySummary.returnedHome = true;

  // Award "Quartermaster" bonus: +1 of 2 random resources collected today
  const collectedToday = Object.keys(resourcesToday);
  const sample = randomArraySampleWithoutReplacement(collectedToday, 2);
  if (sample.length > 0) {
    eventText.value = `Returned home! Bonus: ${sample.map(s => `+1 ${s}`).join(', ')}`;
    daySummary.quartermasterBonusResources = sample;
    for (const resource of sample) {
      resources[resource] = (resources[resource] ?? 0) + 1;
    }
  } else {
    eventText.value = 'Returned home! No resources collected today, so no bonus.';
  }

  // Turn-in resources for in-progress construction
  if (construction.value) {
    const turnedIn = construction.value.turnInResources(resources);
    daySummary.constructionTurnedInResources = turnedIn;

    if (turnedIn) {
      console.log('Turned in resources for construction:', turnedIn);

      const completed = construction.value.completeMaybe(day.value);
      if (completed) {
        daySummary.constructionCompleted = construction.value;

        // Clear construction after completion
        Guild.setConstruction(null);
        construction.value = null;
      }
    } else {
      console.log('No resources to turn in for construction.');
    }
  }
}

function prepOvernightUI() {
  daySummary.resources = { ...resourcesToday };
  daySummary.hero = {
    level: 1,
    xp: resources.xp ?? 0,
    daysUntilRetirement: 3,
  };
  daySummary.construction = construction.value ? {
    name: construction.value.name,
    materials: { ...construction.value.materials }, // Clone to avoid Vue-proxying the main game data object.
    materialsProgress: { ...construction.value.materialsProgress }, // Clone to avoid Vue-proxying the main game data object.
    completionComment: construction.value.completionComment,
  } : null;
  setTimeout(() => {
    console.log('Showing OvernightUI with summary object:', deepClone(daySummary));
    showOvernightUI.value = true;
  }, Constants.dailyReportDelay);
}

const showOvernightUI = ref(false);
const showConstructionUI = ref(false);

function onExitOvernightUI() {
  showOvernightUI.value = false;
  showConstructionUI.value = true;
}

function onExitConstructionUI() {
  showConstructionUI.value = false;
  advanceDay();
}

const construction = shallowRef(Guild.getConstruction());
function onApproveConstruction(newConstruction) {
  construction.value = Guild.setConstruction(newConstruction, day.value);
  console.log('Approved construction:', construction.value);
  onExitConstructionUI();
}

function onSuspendConstruction() {
  const suspended = construction.value;
  construction.value = Guild.setConstruction(null);
  console.log('Suspended construction:', suspended);
  onExitConstructionUI();
}

function advanceDay() {
  // Advance day counter
  day.value += 1;

  // Age the map
  ageMap();
  
  // Reset daily values
  stamina.value = maxStamina.value;
  background.value = 'day';
  eventText.value = '';
  for (const node of nodes) node.visited = false;
  for (const key in resourcesToday) delete resourcesToday[key];
  for (const key in daySummary) delete daySummary[key];

  // Return player to the starting point
  locX.value = 0;
  locY.value = 0;
}

/**
 * Gets the distance between two hex coordinates, using the cube coordinate system.
 * 
 * @param x1 
 * @param y1 
 * @param x2 
 * @param y2 
 */
function hexDistance(x1, y1, x2, y2) {
  const z1 = -y1 - x1;
  const z2 = -y2 - x2;
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2;
}

function distanceFromPlayer(x, y) {
  return hexDistance(locX.value, locY.value, x, y);
}

const stamina = ref(10);
const maxStamina = ref(10);
const maxXp = ref(10);
const day = ref(0);
const daySummary = reactive({});

const tips = [
  `
    You are at the 🔻.
    Click adjacent hexes to move.
    Visiting a hex collects resources.
    Moving uses 1 stamina. When stamina runs out or if you return home, the day will end.
    Return home at the end for a bonus.
  `,
];

const eventText = ref('');

const excludedResources = ['xp'];
</script>

<template>
  <div class="wrap" :class="[{
    'stamina-any': stamina > 0,
    'stamina-low': 1 < stamina && stamina <= 5,
    'stamina-critical': stamina === 1,
    'stamina-empty': stamina === 0
  }, background]">
    <div class="status-hud">
      <div class="numeric-stats-bar">
        <div> Stamina: <span v-text="stamina" class="stamina" /> / {{ maxStamina }} </div>
        <div> XP: <span v-text="resources.xp ?? 0" /> / {{ maxXp }} </div>
        <div v-text="background === 'day' ? '🌞' : '🌙'" />
      </div>
      <div class="resources">
        <div v-for="(resource, key) in resources" :key="key">
          <div v-if="!excludedResources.includes(key)">
            {{ key }}: {{ resource }}
          </div>
        </div>
      </div>
      <div v-if="construction != null">
        Current goal: {{ construction.name }}
        <div class="construction-progress">
          <div v-for="req in construction.materials" :key="req.id">
            {{ req.id }}: {{ req.amount - (construction.materialsProgress[req.id] ?? 0) }}
          </div>
        </div>
      </div>
      <div class="tip" v-if="tips[day]" v-text="tips[day]" />
      <div class="event" v-if="eventText" v-text="eventText" />
    </div>
    <div class="hex-map">
      <div
          v-for="node in nodes"
          :key="`${node.x},${node.y}`"
          class="node"
          :class="[node.type.id, `distance-${distanceFromPlayer(node.x, node.y)}`, { visited: node.visited }]"
          :style="{
            left: `${node.renderX * 10}rem`,
            top: `${node.renderY * 10}rem`,
          }"
          @click="() => onClickNode(node.x, node.y)"
      >
        <span class="node-label" v-text="node.type.label" />
        <div class="player-location-marker" v-if="node.x === locX && node.y === locY">🔻</div>
      </div>
    </div>
  </div>
  <OvernightUI v-if="showOvernightUI" :summary="daySummary" @exit="onExitOvernightUI" />
  <ConstructionUI v-if="showConstructionUI"
      :activeId="construction?.id"
      @construct="onApproveConstruction"
      @suspend="onSuspendConstruction"
      @exit="onExitConstructionUI"
  />
</template>

<style lang="scss" scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;

  transition: background-color 0.5s;

  &.day {
    background-color: #22443E;
  }
  &.night {
    background-color: rgb(12, 12, 56);
  }
}
.status-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem;
  text-align: center;

  .numeric-stats-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 3rem;

    .stamina {
      .stamina-low & {
        color: #ff0;
      }
      .stamina-critical & {
        color: #f80;
      }
      .stamina-empty & {
        color: #f00;
      }
    }
  }

  .resources {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .construction-progress {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
  }

  .tip {
    line-height: 1.2;
  }
}
.hex-map {
  position: relative;
  width: 0;
  height: 0;
}
.node {
  position: absolute;
  width: 10rem;
  height: 11.45rem;
  display: flex;
  justify-content: center;
  align-items: center;
  translate: -50% -50%;

  font-size: 1.5rem;
  color: black;
  
  clip-path: polygon(
    0% 25%,
    0% 75%,
    50% 100%,
    100% 75%,
    100% 25%,
    50% 0%
  );

  outline: 1px solid #0002;
  outline-offset: -1px;

  pointer-events: all;

  transition: filter 0.2s, opacity 0.2s, scale 0.2s;

  .stamina-empty & {
    pointer-events: none;
    &:not(.distance-0) {
      opacity: 0.8;
    }
  }

  .stamina-any & {
    &.distance-1:hover {
      filter: brightness(1.2);
      scale: 1.05;
    }
  
    &:not(.distance-1) {
      pointer-events: none;
    }
  
    &:not(.distance-0):not(.distance-1) {
      opacity: 0.7;
    }
  }

  &.empty, &.visited:not(.hub) {
    background-color: #fff1;
    color: #fff8;
  }

  &.hub {
    background-color: #888;
    outline: 1rem solid #fff4;
    outline-offset: -1rem;
  }

  &.coin {
    background-color: #FEB;
  }

  &.xp {
    background-color: #AFD;
  }

  &.wood {
    background-color: #A52;
  }
  &.stone {
    background-color: #888;
  }
  &.herbs {
    background-color: #4A2;
  }
  &.ore {
    background-color: #654;
  }
}

.player-location-marker {
  position: absolute;
  left: 50%;
  top: 25%;
  translate: -50% -50%;
  font-size: 5rem;
}
</style>