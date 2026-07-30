<script setup>
import { inject } from 'vue';
import TitleScreen from './cmp/title/TitleScreen.vue';
import SettingsScreen from './cmp/settings/SettingsScreen.vue';
import GameScreen from './cmp/game/GameScreen.vue';
import Constants from '../Constants.js';

const modes = Constants.modes;

// Receive as app.provide() / inject() so we can more easily expose to VueInterface
const props = inject('props');
</script>

<template>
  <div class="vueAppWrap">
    <TitleScreen v-if="props.mode === modes.title" :userSettings="props.userSettings" />
    <SettingsScreen v-if="props.mode === modes.settings" :settings="props.userSettings" />
    <GameScreen v-if="props.mode === modes.game" :hero="props.hero" :world="props.world" :game="props.game" />
  </div>
</template>

<style scoped>
.vueAppWrap {
  width: 100%;
  height: 100%;

  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}
</style>
