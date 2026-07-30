/**
 * @fileoverview
 * Helper functions, implements the "Quartermaster" construction bonus effects,
 * which grant players bonus resources upon ending the day at the Guild.
 */

import { randomArraySampleWithoutReplacement } from "../util/random.js";
import Construction from "./Construction.js";

/**
 * 
 * @param {{ [id: string]: number }} resourcesToday
 * @returns {{ [id: string]: number }} A new object representing the resources awarded, if any.
 */
export function getQuartermasterBonusResources(resourcesToday) {
  if (Construction.isComplete('quartermaster')) {
    // One of each of two random resource types that were collected today.
    const types = Object.keys(resourcesToday);
    const sample = randomArraySampleWithoutReplacement(types, 2);
    if (sample.length) return _oneOfEach(sample);
  }

  // Runoff to lower-tier bonus if no resources yet given.
  if (true) { // Placeholder for when we split this construction into multiple tiers; this is the lower rank.
    // One coin, always.
    return { coin: 1 };
  }
  
  return {};
}

/**
 * @param {string[]} types
 * @returns {{ [id: string]: number }} A new object with one of each resource type, with a quantity of 1.
 */
function _oneOfEach(types) {
  const result = {};
  for (const type of types) result[type] = 1;
  return result;
}