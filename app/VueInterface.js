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
    /** @type {{ [resourceType: string]: number }} */
    resources: {},
  },

  world: {
    origin: { x: 0, y: 0 },
    radius: 0,
    /** @type {{ x: number, y: number, renderX: number, renderY: number, distance: number, type: string, visited: boolean }[][]} */
    map: [],
  },

  game: {
    /** @type {{ id: string, name: string, materials: { [resourceType: string]: number }, materialsProgress: { [resourceType: string]: number } }?} */
    activeConstruction: null,
  
    eventText: '',
    /** @type {'day' | 'night'} */
    time: 'day',
    showOvernightUi: false,
    showConstructionUi: false,
  },

  /** Programmatically copied from Settings.user; only need to intialize these keys to avoid crash-on-load due to access before programmatic initialization. */
  userSettings: {
    sound: { effects: true },
  },
});

window.GlobalVueProps = GlobalVueProps;
export default GlobalVueProps;