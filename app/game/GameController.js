import GlobalVueProps from '../VueInterface.js';
import Settings from '../Settings.js';
import Constants from '../Constants.js';
import UserSettingsManager from '../UserSettingsManager.js';
import Hero from './Hero.js';

const { modes } = Constants;

export default class GameController {
  /** @type {modes} */
  mode = modes.title;

  /** @type {Hero} */
  hero;

  begin() {
    UserSettingsManager.syncVue();
    this.showTitleScreen();
  }

  showTitleScreen() {
    GameController.setMode(modes.title);
  }

  onAdvanceFromTitleScreen() {
    this.initialize();
    GameController.setMode(modes.game);
  }

  initialize() {
    this.hero = new Hero();
    this.hero.updateVue();
  }

  static onSettingsClicked() {
    GameController.setMode(modes.settings);
  }

  static setMode(mode) {
    if (Settings.test?.log?.uiModeChanges) console.log(`Setting mode to ${mode}`);
    GlobalVueProps.mode = mode;
  }
}