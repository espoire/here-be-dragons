<script setup>
import OvernightUI from './OvernightUI.vue';
import ConstructionUI from './ConstructionUI.vue';
import Globals from '/app/Globals.js';
import HexTileMap from '/app/game/hex/HexTileMap.js';
import { tips } from './dailyTips.js';
import { computed } from 'vue';
import { not, nullish } from '/app/util/Util.js';

const props = defineProps({
  hero: {
    xp: { current: Number, nextLevel: Number },
    stamina: { current: Number, max: Number },
    position: { x: Number, y: Number },
    resources: Object, // { [resourceType: string]: number }
  },
  world: {
    origin: { x: Number, y: Number },
    radius: Number,
    map: Array, // Rectangular array of { x, y, renderX, renderY, distance, type, visited }, some array locations contain nulls.
  },
  activeConstruction: {
    id: String,
    name: String,
    materials: Object, // { [resourceType: string]: number }
    materialsProgress: Object, // { [resourceType: string]: number }
  },
  game: {
    eventText: String,
    day: Number,
    time: String, // 'day' or 'night'
    showOvernightUi: Boolean,
    showConstructionUi: Boolean,
    daySummary: Object,
  },
});

function onClickTile(x, y) { Globals.game.onClickMapTile(x, y); }
function onExitOvernightUI() { Globals.game.onExitOvernightUI(); }
function onExitConstructionUI() { Globals.game.onExitConstructionUI(); }
function onApproveConstruction(newConstruction) { Globals.game.onApproveConstruction(newConstruction); }
function onSuspendConstruction() { Globals.game.onSuspendConstruction(); }

function distanceFromPlayer(x, y) {
  return HexTileMap.hexDistance(x, y, props.hero.position.x, props.hero.position.y);
}

const tiles = computed(() => {
  const map = props.world?.map;
  if (!map) return [];
  return map.flat().filter(not(nullish));
});
</script>

<template>
  <div class="wrap" :class="[{
    'stamina-any': hero.stamina.current > 0,
    'stamina-low': 1 < hero.stamina.current && hero.stamina.current <= 5,
    'stamina-critical': hero.stamina.current === 1,
    'stamina-empty': hero.stamina.current === 0
  }, game.time]">
    <div class="status-hud">
      <div class="numeric-stats-bar">
        <div> Stamina: <span v-text="hero.stamina.current" class="stamina" /> / {{ hero.stamina.max }} </div>
        <div> XP: <span v-text="hero.xp.current" /> / {{ hero.xp.nextLevel }} </div>
        <div v-text="game.time === 'day' ? '🌞' : '🌙'" />
      </div>
      <div class="resources">
        <div v-for="(resource, key) in hero.resources" :key="key">
          <div v-if="!['xp'].includes(key)">
            {{ key }}: {{ resource }}
          </div>
        </div>
      </div>
      <div v-if="game.activeConstruction != null">
        Current goal: {{ game.activeConstruction.name }}
        <div class="construction-progress">
          <div v-for="(amount, material) in game.activeConstruction.materials" :key="material">
            {{ material }}: {{ amount - (game.activeConstruction.materialsProgress[material] ?? 0) }}
          </div>
        </div>
      </div>
      <div class="tip" v-if="tips[game.day]" v-text="tips[game.day]" />
      <div class="event" v-if="game.eventText" v-text="game.eventText" />
    </div>
    <div class="hex-map">
      <div
          v-for="tile in tiles"
          :key="`${tile.x},${tile.y}`"
          class="node"
          :class="[tile.type.id, `distance-${distanceFromPlayer(tile.x, tile.y)}`, { visited: tile.visited }]"
          :style="{
            left: `${tile.renderX * 10}rem`,
            top: `${tile.renderY * 10}rem`,
          }"
          @click="() => onClickTile(tile.x, tile.y)"
      >
        <span class="tile-label" v-text="tile.type.label" />
        <div class="player-location-marker" v-if="tile.x === hero.position.x && tile.y === hero.position.y">🔻</div>
      </div>
    </div>
  </div>
  <OvernightUI v-if="game.showOvernightUi" :summary="game.daySummary" @exit="onExitOvernightUI" />
  <ConstructionUI v-if="game.showConstructionUi"
      :activeId="game.activeConstruction?.id"
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