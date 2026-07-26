/** @typedef {import('./Construction.js').default} Construction */

import Settings from '../Settings.js';
import Construction from './Construction.js';

/** @fileoverview A model object representing the Heroes' Guild's persistent state. */
export default class Guild {
  /** @type {string?} */ static activeConstructionId = (
    Construction.isValidId(Settings.test.initialGuildConstruction) ? Settings.test.initialGuildConstruction : null
  );

  /**
   * @param {Construction} construction
   * @returns {Construction?} The construction that was set as active, or null if it failed some kind of validation check.
   */
  static setConstruction(construction) {
    Guild.activeConstructionId = construction.id;
    return construction;
  }

  static getConstruction() {
    return Construction.getById(Guild.activeConstructionId);
  }
}