<script setup>
import { ref, computed } from 'vue';
import PrettyButton from '../util/PrettyButton.vue';
import ConstructionForm from './ConstructionForm.vue';
import Construction from '../../../game/Construction.js';

const emit = defineEmits(['construct', 'exit']);

const currentFormIndex = ref(1);
const construction = computed(() => Construction.getByIndex(currentFormIndex.value));

function onPrevious() {
  if (currentFormIndex.value > 0) currentFormIndex.value -= 1;
}

function onNext() {
  if (currentFormIndex.value < Construction.maxIndex - 1) currentFormIndex.value += 1;
}
</script>

<template>
  <div class="mask">
    <div class="column-wrap">
      <ConstructionForm :construction="construction" />
      <PrettyButton class="sign-button" @click="emit('construct', construction)">Authorize<br />Construction</PrettyButton>
      <PrettyButton class="previous-button" @click="onPrevious">Previous</PrettyButton>
      <PrettyButton class="next-button" @click="onNext">Next</PrettyButton>
    </div>
    <PrettyButton class="done-button" @click="emit('exit')">Return to<br />Adventuring</PrettyButton>
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

  pointer-events: all;
}

.column-wrap {
  position: absolute;
  width: fit-content;
  height: fit-content;
  left: 50%;
  bottom: 15%;
  translate: -50% 0;

  outline: 1px solid violet;
}

.buttonWrap {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 4rem;
}

.sign-button {
  position: absolute;
  left: 50%;
  top: 97%;
  translate: -50% 0;
  background-color: #240;
}

.previous-button {
  position: absolute;
  left: -1rem;
  top: 94%;
  translate: 0 50%;
  background-color: #024;
}

.next-button {
  position: absolute;
  right: -1rem;
  top: 94%;
  translate: 0 50%;
  background-color: #024;
}

.done-button {
  position: absolute;
  left: 50%;
  translate: -50% 0;
  bottom: 2rem;
  background-color: #420;
}
</style>