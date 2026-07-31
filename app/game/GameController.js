import GlobalVueProps from '../VueInterface.js';
import Settings from '../Settings.js';
import Constants from '../Constants.js';
import UserSettingsManager from '../UserSettingsManager.js';
import Hero from './Hero.js';
import Guild from './Guild.js';
import WorldMap from './hex/WorldMap.js';
import { getQuartermasterBonusResources } from './quartermaster.js';
import DaySummary from './DaySummary.js';
import Construction from './Construction.js';

const { modes } = Constants;

export default class GameController {
  static onSettingsClicked() {
    GameController.setMode(modes.settings);
  }

  static setMode(mode) {
    if (Settings.test?.log?.uiModeChanges) console.log(`Setting mode to ${mode}`);
    GlobalVueProps.mode = mode;
  }

  /** @type {modes} */
  mode = modes.title;

  /** @type {Hero} */
  hero;

  /** @type {WorldMap} */
  worldMap;

  /** @type {number} */
  day = 1;

  /** @type {DaySummary} */
  daySummary;

  /** @type {number} Modifier to add to tomorrow's Stamina, based on where the Hero slept. 0 = best, negative values = worse. */
  restQuality = 0;

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
    const worldMap = new WorldMap(Guild.mapRadius);
    worldMap.updateVue();
    this.worldMap = worldMap;

    const hero = new Hero();
    hero.xp = Guild.newHeroXp;
    hero.maxStamina = hero.stamina = Guild.newHeroStamina;
    hero.position = worldMap.origin;
    hero.updateVue();
    this.hero = hero;

    GlobalVueProps.game.day = this.day;
    GlobalVueProps.game.activeConstruction = GameController.getActiveConstruction()?.toVue();

    this.daySummary = new DaySummary();
  }

  onClickMapTile(x, y) {
    if (this.hero.stamina <= 0) return; // Can't move if out of stamina

    this.#moveToNode(x, y);
    this.endOfDayMaybe();
  }

  #moveToNode(x, y) {
    // Update hero position & spend stamina
    this.hero.position = { x, y };
    this.hero.stamina -= 1;
    
    // If tile is fresh (not visited), collect resources if applicable
    const tile = this.worldMap.tileAt({ x, y });
    if (!tile) return;
    this.collectResourceFromTile(tile);
    
    // Mark tile as visited
    if (!tile.visited) this.daySummary.nodesVisited = (this.daySummary.nodesVisited ?? 0) + 1;
    tile.visited = true;
    this.worldMap.updateCellVue(x, y);
  }

  collectResourceFromTile(tile) {  
    if (tile?.visited !== false) return; // Only collect resources from extant, unvisited tiles

    const resource = tile.type.resource;
    if (!resource) return;

    GameController.setVueEventText(`+1 ${resource}!`);
    this.hero.gainResource(resource, 1);
  }

  static setVueEventText(text) { GlobalVueProps.game.eventText = text; }

  endOfDayMaybe() {
    const tile = this.worldMap.tileAt(this.hero.position);
    const returnedHome = (tile.type.id === 'hub');
    const endOfDay = (returnedHome || this.hero.stamina <= 0);
    if (!endOfDay) return;

    GlobalVueProps.game.time = 'night';
    this.returnedHomeMaybe(returnedHome);
    this.prepOvernightUI();
  }

  returnedHomeMaybe(returnedHome) {
    if (!returnedHome) {
      this.restQuality = -4; // Poor quality rest for camping in the wild.
      GameController.setVueEventText('Out of stamina! Making camp for the night...');
      return;
    }

    this.restQuality = 0; // Best quality rest for sleeping at home.
    this.daySummary.returnedHome = true;
    this.applyQuartermasterBonusMaybe();
    this.turnInResourcesForConstructionMaybe();
  }

  applyQuartermasterBonusMaybe() {
    // Award "Quartermaster" bonus: +1 of 2 random resources collected today
    const bonus = getQuartermasterBonusResources(this.hero.resourcesToday);
    const bonusTypes = Object.keys(bonus);
    if (bonusTypes.length > 0) {
      GameController.setVueEventText(`Returned home! Bonus: ${bonusTypes.map(s => `+1 ${s}`).join(', ')}`);
      this.daySummary.quartermasterBonusResources = bonusTypes; // TODO support non-1 amounts
      for (const type of bonusTypes) {
        this.hero.gainResource(type, bonus[type]);
      }
    } else {
      GameController.setVueEventText('Returned home! No resources collected today, so no bonus.');
    }
  }

  static getActiveConstruction() { return Construction.getById(Guild.activeConstructionId); }

  turnInResourcesForConstructionMaybe() {
    const construction = GameController.getActiveConstruction();
    if (!construction) return console.log('No active construction to turn in resources for.');

    const turnedIn = construction.turnInResources(this.hero.resources);
    this.daySummary.constructionTurnedInResources = turnedIn;

    if (!turnedIn) return console.log('No resources to turn in for construction.');

    console.log('Turned in resources for construction:', turnedIn);
    this.hero.loseResources(turnedIn);

    const completed = construction.completeMaybe(this.day, this.hero.name);
    if (!completed) return console.log('Construction not yet complete:', construction);

    console.log('Construction completed:', construction);
    Guild.setActiveConstruction(null);
    GlobalVueProps.game.activeConstruction = null;
    this.daySummary.constructionCompleted = construction;
  }

  prepOvernightUI() {
    this.daySummary.resources = this.hero.resourcesToday;
    this.daySummary.hero = {
      level: this.hero.level,
      xp: this.hero.xp,
      daysUntilRetirement: 3,
    };

    const construction = GameController.getActiveConstruction();
    this.daySummary.construction = construction ? {
      name: construction.name,
      materials: { ...construction.materials }, // Clone to avoid Vue-proxying the main game data object.
      materialsProgress: { ...construction.materialsProgress }, // Clone to avoid Vue-proxying the main game data object.
      completionComment: construction.completionComment,
    } : null;

    GlobalVueProps.game.daySummary = this.daySummary.toVue();

    setTimeout(() => {
      console.log('Showing OvernightUI with summary object:', { ...this.daySummary });
      GlobalVueProps.game.showOvernightUi = true;
    }, Constants.dailyReportDelay);
  }

  onExitOvernightUI() {
    GlobalVueProps.game.showOvernightUi = false;
    GlobalVueProps.game.showConstructionUi = true;
  }

  onApproveConstruction(newConstruction) {
    Guild.setActiveConstruction(newConstruction, this.day, this.hero.name);
    GlobalVueProps.game.activeConstruction = newConstruction.toVue();
    console.log('Approved construction:', newConstruction);
    this.onExitConstructionUI();
  }

  onSuspendConstruction() {
    Guild.setActiveConstruction(null);
    GlobalVueProps.game.activeConstruction = null;
    console.log('Suspended construction.');
    this.onExitConstructionUI();
  }

  onExitConstructionUI() {
    GlobalVueProps.game.showConstructionUi = false;
    this.advanceDay();
  }

  advanceDay() {
    // Advance day counter
    this.day++;

    // Age the map
    this.worldMap.age();
    this.worldMap.resetTilesVisited();
    this.worldMap.updateVue();
    
    // Reset daily values
    this.hero.rest(this.restQuality);
    this.hero.dailyReset();
    GlobalVueProps.game.time = 'day';
    GlobalVueProps.game.eventText = '';
    this.daySummary = new DaySummary();
  }
}