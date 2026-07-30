/** @typedef {import('./Construction').default} Construction */

/**
 * A data-transfer struct for taking notes about what happened during a day of adventuring, to be displayed in the Nightly Report UI.
 */
export default class DaySummary {
  nodesVisited = 0;
  /** @type {{ [resourceType: string]: number }} */
  resourcesCollected = {};
  returnedHome = false;
  /** @type {string[]} The resources awarded by the Quartermaster bonus. */
  quartermasterBonusResources = [];
  /** @type {{ [resourceType: string]: number }?} */
  constructionTurnedInResources = null;
  /** @type {Construction?} The Construction which was completed today, if any. Null otherwise. */
  constructionCompleted = null;
  /** @type {{ [resourceType: string]: number }} */
  resources = {};
  hero = {
    level: 1,
    xp: 0,
    daysUntilRetirement: 3,
  };
  /** @type {{ name: string, materials: { [resourceType: string]: number }, materialsProgress: { [resourceType: string]: number }, completionComment: string }?} */
  construction = null;

  toVue() {
    const ret = {};
    for (const key of Object.keys(this)) {
      if (typeof this[key]?.toVue === 'function') {
        ret[key] = this[key].toVue();
      } else {
        ret[key] = this[key];
      }
    }
    return ret;
  }
}