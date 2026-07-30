import { weightedRandomArrayElement } from "../../util/random.js";

const definitions = [{
  id: 'hub',
  label: 'home',
  decay: 0,
}, {
  id: 'empty',
  label: 'barren',
  weight: 5,
  decay: 0.6,
}, {
  id: 'coin',
  weight: 50,
  resource: 'coin',
  decay: 0.4,
}, {
  id: 'xp',
  weight: 50,
  resource: 'xp',
  decay: 0.4,
}, {
  id: 'wood',
  weight: 1,
  resource: 'wood',
  decay: 0.2,
}, {
  id: 'stone',
  weight: 1,
  resource: 'stone',
  decay: 0.2,
}, {
  id: 'herbs',
  weight: 1,
  resource: 'herb',
  decay: 0.2,
}, {
  id: 'ore',
  weight: 1,
  resource: 'ore',
  decay: 0.2,
}];

/**
 * A class representing and managing the different types of map nodes in the game.
 */
export default class WorldTileType {
  /** @type {Map<string, WorldTileType>} */
  static #byId = new Map();
  /** @type {WorldTileType[]} */
  static #list = [];

  static loadDefinitions() {
    if (this.#list.length) return;
    for (const def of definitions) {
      const nodeType = new WorldTileType(def);
      nodeType.index = this.#list.length;

      this.#byId.set(nodeType.id, nodeType);
      this.#list.push(nodeType);
    }
  }

  static getById(id) {
    return this.#byId.get(id);
  }

  static getByIndex(index) {
    return this.#list[index];
  }

  static spawn() {
    return weightedRandomArrayElement(this.#list, this.#list.map(nodeType => nodeType.weight));
  }

  /** @type {number} */ index;
  /** @type {string} The textual programmatic ID of this node type. */ id;
  /** @type {string} The player-facing node type name. */ label;
  /** @type {number} Appearance rate of this node type in random spawns. Probability is (weight / totalWeight). */ weight;
  /** @type {string?} The string ID of the resource gained by visiting this node type. No resource is granted if falsy. */ resource;
  /** @type {number} The decay rate of this node type. A value of 1 means immediate type reroll each night, while a value of 0 means the node will persist forever. */ decay;

  constructor({ id, label = id, weight = 0, resource = null, decay = 1 }) {
    this.id = id;
    this.label = label;
    this.weight = weight;
    this.resource = resource;
    this.decay = decay;
  }
}

WorldTileType.loadDefinitions();