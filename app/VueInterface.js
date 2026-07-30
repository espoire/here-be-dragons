import { reactive } from 'vue';

/** Exposes a collection of proxies for sending data into the Vue context for rendering to the 2D UI */
const GlobalVueProps = reactive({
  mode: 'title',

  hero: {
    xp: {
      current: 0,
      nextLevel: 0,
    },
    stamina: {
      current: 0,
      max: 0,
    },
  },

  /** Programmatically copied from Settings.user; only need to intialize these keys to avoid crash-on-load due to access before programmatic initialization. */
  userSettings: {
    sound: { effects: true },
  },
});

window.GlobalVueProps = GlobalVueProps;
export default GlobalVueProps;