import Settings from '../Settings.js';

/** @fileoverview A model object representing the Heroes' Guild's persistent state. */
export default class Guild {
  /** @type {string?} */ static activeConstructionId = Settings.test.initialGuildConstruction;

  static newHeroXp = 0; // Amount of XP new Heroes start with.
  static newHeroStamina = 10; // Amount of maximum stamina new Heroes start with.

  static #mapRadius = 5; // The radius of the map, in hexes, from the Guild Hall to the edge of the map.
  static set mapRadius(value) { Guild.#mapRadius = value; /* TODO actually resize the current map */ }
  static get mapRadius() { return Guild.#mapRadius; }

  /**
   * @param {Construction?} construction The construction to set as active, or null to clear the active construction.
   * @returns {Construction?} The construction that was set as active, or null if it failed some kind of validation check.
   */
  static setConstruction(construction, day = 0, assigneeName, approverName = 'Jenny Erik, Guild Paper Pusher') {
    Guild.activeConstructionId = construction?.id;
    construction?.activate(day, assigneeName, approverName);
    return construction;
  }
}