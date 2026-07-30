<script setup>
defineProps({
  subheader: String,
});
</script>

<template>
  <div class="scroll-column">
    <h1>Heroes Guild</h1>
    <h3 v-if="subheader" v-text="subheader" />
    <hr />
    <slot />
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
    margin-bottom: 2rem;
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
}
</style>