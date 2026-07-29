/** @typedef {import('./Construction.js').default} Construction */

import Settings from '../Settings.js';
import Construction from './Construction.js';

/** @fileoverview A model object representing the Heroes' Guild's persistent state. */
export default class Guild {
  /** @type {string?} */ static activeConstructionId = (
    Construction.isValidId(Settings.test.initialGuildConstruction) ? Settings.test.initialGuildConstruction : null
  );

  /**
   * @param {Construction?} construction The construction to set as active, or null to clear the active construction.
   * @returns {Construction?} The construction that was set as active, or null if it failed some kind of validation check.
   */
  static setConstruction(construction, day = 0, assigneeName = 'Hero', approverName = 'Jenny Erik, Guild Paper Pusher') {
    Guild.activeConstructionId = construction?.id;
    construction?.activate(day, assigneeName, approverName);
    return construction;
  }

  static getConstruction() {
    return Construction.getById(Guild.activeConstructionId);
  }
}