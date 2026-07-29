<script setup>
defineProps({
  // settings: {
  //   type: Object,
  //   required: true,
  // },
  summary: {
    type: Object, // @type {{ nodesVisited: number, resources: Object<string, number>, quartermasterBonusResources: string[], hero: { level: number, xp: number, daysUntilRetirement: number } }}
    required: true,
  },
});

const emit = defineEmits(['exit']);
</script>

<template>
  <div class="mask" @click="emit('exit')">
    <div class="scroll-column">
      <h1>Heroes Guild</h1>
      <h3>Daily Report, Day N, [Heroname]</h3>
      <hr />

      <h2>Expedition</h2>
      <p>Visited {{ summary.nodesVisited }} locations.</p>

      <template v-if="summary.resources && Object.keys(summary.resources).length > 0">
        <template v-if="!summary.resources.xp || Object.keys(summary.resources).length > 1">
          <p>Gathered the following resources:</p>
          <div class="spaced-horizontal-list-row">
            <template v-for="(amount, resource) in summary.resources" :key="resource">
              <div v-if="!['xp'].includes(resource)">
                {{ amount }}x {{ resource }}
              </div>
            </template>
          </div>
        </template>

        <p v-if="summary.resources.xp">I gained {{ summary.resources.xp }} XP.</p>

        <div class="slight-vertical-gap" />
      </template>


      <template v-if="summary.returnedHome && summary.quartermasterBonusResources && Object.keys(summary.quartermasterBonusResources).length > 0">
        <p>Upon my safe return, the quartermaster awarded me:</p>
        <div class="spaced-horizontal-list-row">
          <div v-for="resource in summary.quartermasterBonusResources" :key="resource">
            1x {{ resource }}
          </div>
        </div>
      </template>
      <p v-else-if="summary.returnedHome">
        I returned home safely, before dark.
      </p>

      <h2>Construction</h2>

      <template v-if="summary.construction || summary.constructionCompleted">
        <template v-if="summary.constructionTurnedInResources">
          <p v-if="!summary.constructionCompleted">I turned in the following resources for the {{ summary.construction.name }}:</p>
          <p v-else>I turned in the last of the resources for the {{ summary.constructionCompleted.name }}!</p>
          <div class="spaced-horizontal-list-row">
            <div v-for="(amount, resource) in summary.constructionTurnedInResources" :key="resource">
              {{ amount }}x {{ resource }}
            </div>
          </div>
        </template>
        <template v-else>
          <p v-if="summary.returnedHome">I did not find any suitable resources for the {{ summary.construction.name }} today.</p>
          <p v-else>I did not return to the Guild in time to turn in resources tonight.</p>
        </template>
        
        <div v-if="summary.constructionCompleted" style="position: relative; width: 100%;">
          <p>That's everything!</p>
          <p>The {{ summary.constructionCompleted.name }} is ready for construction!</p>
          <p class="scribbled-margin-comment">{{ summary.constructionCompleted.completionComment }}</p>
        </div>
        <template v-else>
          <p>So far, I have procured the following resources to construct the {{ summary.construction.name }}:</p>
          <div class="spaced-horizontal-list-row">
            <div v-for="{ id, amount } in summary.construction.materials" :key="id">
              {{ summary.construction.materialsProgress[id] || 0 }} of {{ amount }} {{ id }}
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <p>I have not been assigned to any construction project.</p>
      </template>

      <h2>Hero</h2>
      <div class="spaced-horizontal-list-row">
        <div>Level {{ summary.hero.level }}</div>
        <div><span class="sup">{{ summary.hero.xp }}</span> / <span class="sub">10</span> XP</div>
      </div>
      <p>My hero license expires in {{ summary.hero.daysUntilRetirement }} days.</p>
    </div>
    <div class="click-to-advance-text">
      <p>Click to continue...</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000D;

  display: flex;
  justify-content: center;

  pointer-events: all;
  user-select: all;
}

.scroll-column {
  width: 100rem;
  height: 100%;
  overflow-y: auto;
  background-color: tan;
  font-family: "Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive;
  text-align: center;
  color: black;
  font-size: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-size: 8rem;
    color: #800;
    line-height: 1;
  }

  h3 {
    font-size: 3rem;
  }

  hr {
    border-color: #0004;
    width: 80%;
  }

  h2 {
    font-size: 4rem;
    margin-top: 2rem;
  }

  .slight-vertical-gap {
    height: 2rem;
  }

  .spaced-horizontal-list-row {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin-top: -1rem;
  }

  .scribbled-margin-comment {
    position: absolute;
    top: 2rem;
    right: 5rem;
    max-width: 20%;
    font-size: 80%;
    line-height: 0.7;
    rotate: 25deg;
  }
}

.sup {
  font-size: 2rem;
  vertical-align: super;
}

.sub {
  font-size: 2rem;
  vertical-align: sub;
}

.click-to-advance-text {
  position: absolute;
  z-index: 1;
  bottom: 0;
  width: 100rem;
  text-align: right;
  font-size: 8rem;
  color: #800;
  padding: 1rem;
  font-family: "Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive;
  font-weight: bold;

  animation: fadeIn 2s both;
  animation-delay: 15s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>