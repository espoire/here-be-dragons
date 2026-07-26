<script setup>
defineProps({
  construction: Object,
});
</script>

<template>
  <div class="scroll-column">
    <h1>Heroes Guild</h1>
    <h3>Construction Requisition Form 0211-A</h3>
    <hr />

    <div class="slight-vertical-gap" />

    <h4>Project:</h4>
    <h2 v-text="construction.name" />

    <div class="slight-vertical-gap" />

    <h4>Justification:</h4>
    <u v-text="construction.justificationText" />
    
    <h4>Expected Benefit:</h4>
    <u v-text="construction.benefitText" />

    <h4>Materials Required:</h4>
    <div class="spaced-horizontal-list-row">
      <div
          v-for="resource in construction.materials"
          :key="resource.id"
      >
        {{ resource.amount }}x {{ resource.id }}
      </div>
    </div>

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
    margin-top: -1rem;
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