import { ensureArray } from './util/Array.js';
import { deepClone } from './util/object.js';
import { deepFreeze, environmentIsDev, educatedGuessIfEnvironmentIsMobile } from './util/Util.js';

/** Test settings, and user-configurable settings. */
const Settings = {
  test: {
    // Meta
    // disableTestMode: true,

    // Startup
    // initialGuildConstruction: 'guild-hall', // string construction ID
    initialConstructionsComplete: 'guild-hall', // string or string[] construction ID(s)

    // Re-config
    easyConstructions: true, // If true, all constructions will cost only 1 coin to complete.

    log: {
      modalEventRouting: true,
      uiModeChanges: false, // Logs whenever GameController.setMode is called (e.g. swapping fullscreen UIs like: combat/roleplay/map)
    },
  },

  user: {
    isMobile: educatedGuessIfEnvironmentIsMobile(),
    sound: {
      effects: true,
    },
  },
};

export const defaultUserSettings = deepClone(Settings.user);
deepFreeze(defaultUserSettings);

if (environmentIsDev() && !Settings.test.disableTestMode) {
  console.log('Test mode is enabled.');
} else {
  Settings.test = {};
}

if (Settings.test?.initialConstructionsComplete) {
  Settings.test.initialConstructionsComplete = ensureArray(Settings.test.initialConstructionsComplete);
}

deepFreeze(Settings.test);
export default Settings;

window.Settings = Settings;