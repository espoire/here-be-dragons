<script setup>
defineProps({
  construction: Object,
  active: Boolean,
  anyActive: Boolean,
});
</script>

<template>
  <div class="scroll-column">
    <h1>Heroes Guild</h1>
    <template v-if="!active">
      <h3 v-if="!construction.wasActive">Construction Requisition Form 0211-A</h3>
      <h3 v-else>Suspended Project Reactivation Form 0211-B</h3>
      <hr />
      <div class="slight-vertical-gap" />
  
      <h4>Project:</h4>
      <h2 v-text="construction.description" />
      <div class="slight-vertical-gap" />
  
      <template v-if="!construction.wasActive">
        <h4>Justification:</h4>
        <u v-text="construction.justificationText" />
      </template>
      <h4>Expected Benefit:</h4>
      <u v-text="construction.benefitText" />
      <template v-if="!construction.wasActive">
        <h4>Materials Required:</h4>
        <div class="spaced-horizontal-list-row">
          <div
              v-for="resource in construction.materials"
              :key="resource.id"
          >
            {{ resource.amount }}x {{ resource.id }}
          </div>
        </div>
      </template>
      <template v-else>
        <h4>Materials Procurement Progress:</h4>
        <div class="spaced-horizontal-list-row">
          <div v-for="req in construction.materials" :key="req.id">
            {{ construction.materialsProgress[req.id] ?? 0 }} of {{ req.amount }} {{ req.id }}
          </div>
        </div>
      </template>

      <template v-if="anyActive">
        <div class="slight-vertical-gap" />
        <h4>Note:</h4>
        <u>Another construction project is currently active.</u><u>Authorizing this project will suspend the other project.</u><u>See attached form 0211-C for details.</u>
        <div class="slight-vertical-gap" />
      </template>
  
      <div class="signature-block">
        <div>
          <h4>Materials Procurement Assigned to:</h4>
          <u>[Heroname PH]</u>
        </div>
        <div>
          <h4>Construction Approved by:</h4>
          <u class="signature">Jenny Erik, Guild Paper Pusher</u>
        </div>
      </div>
    </template>
    <template v-else>
      <h3>Construction Project Amendment Form 0211-C</h3>
      <hr />
      <div class="slight-vertical-gap" />

      <h4>Project:</h4>
      <h2 v-text="construction.description" />
      <div class="slight-vertical-gap" />

      <h4>Benefit:</h4>
      <u v-text="construction.benefitText" />
      <h4>Materials Procurement Progress:</h4>
      <div class="spaced-horizontal-list-row">
        <div v-for="req in construction.materials" :key="req.id">
          {{ construction.materialsProgress[req.id] ?? 0 }} of {{ req.amount }} {{ req.id }}
        </div>
      </div>
      <div class="slight-vertical-gap" />

      <h4>Proposed Change:</h4>
      <u>Suspend materials collection.</u>
      <h4>Justification:</h4>
      <u>Frees up Guild resources for other purposes.</u>
      <div class="slight-vertical-gap" />

      <div class="signature-block">
        <div>
          <h4>Materials Procurement Currently Assigned to:</h4>
          <u>[Heroname PH]</u>
        </div>
        <div>
          <h4>Amendment Proposed by:</h4>
          <u class="signature">Jenny Erik, Guild Paper Pusher</u>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.scroll-column {
  width: 100rem;
  height: fit-content;
  max-height: 85%;
  overflow-y: auto;
  background-color: tan;
  font-family: "Brush Script MT", "Lucida Handwriting", "Segoe Script", cursive;
  line-height: 1.2;
  text-align: center;
  color: black;
  font-size: 3rem;
  padding-top: 2rem;
  padding-bottom: 2rem;
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
    margin-bottom: -2rem;
  }

  h4 {
    font-size: 3rem;
    line-height: 1;
    margin-top: 2rem;
  }

  h2 {
    font-size: 4rem;
    line-height: 1;
    color: #240;
    text-decoration: underline;
    text-decoration-color: #000;
  }

  .slight-vertical-gap {
    height: 2rem;
  }

  .spaced-horizontal-list-row {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin-top: 1rem;
  }

  .signature-block {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    h4 {
      margin-top: 1rem;
    }

    .signature {
      animation: oscillate-opacity 2s infinite;
    }
  }
}

@keyframes oscillate-opacity {
  0% { opacity: 0.7; }
  50% { opacity: 0.3; }
  100% { opacity: 0.7; }
}
</style>