import { randBool } from "../util/random.js";
import NodeType from "./NodeType.js";

export default class Node {
  /** @type {number} */ x;
  /** @type {number} */ y;
  /** @type {NodeType} */ type;
  /** @type {boolean} */ visited = false;

  get renderX() { return this.x + this.y / 2; }
  get renderY() { return this.y * Math.sqrt(3) / 2; }

  /**
   * @param {number} x The world x coordinate of this node.
   * @param {number} y The world y coordinate of this node.
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;

    if (x === 0 && y === 0) {
      this.type = NodeType.getById('hub');
      this.visited = true;
    } else {
      this.type = NodeType.spawn();
    }
  }

  age(days = 1) {
    if (!this.type.decay) return;

    const decayChance = 1 - Math.pow(1 - this.type.decay, days);
    if (randBool(decayChance)) this.type = NodeType.spawn();
  }
}