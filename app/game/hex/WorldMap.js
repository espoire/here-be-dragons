import GlobalVueProps from "../../VueInterface.js";
import HexTileMap from "./HexTileMap.js";
import WorldTile from "./WorldTile.js";

/**
 * A game state model class, which handles creating and updating the hex-grid world map.
 */
export default class WorldMap extends HexTileMap {
  constructor(radius = 5) {
    super(
      radius,
      (x, y) => new WorldTile(x, y),
    );
  }

  updateVue() {
    const vm = GlobalVueProps.world;

    vm.origin = this.origin;
    vm.radius = this.radius;
    vm.map = this.hexMap.map(row => row.map(tile => tile?.toVue()));
  }

  /**
   * 
   * @param {number} x The world x-coordinate of the cell to update.
   * @param {number} y The world y-coordinate of the cell to update.
   */
  updateCellVue(x, y) {
    const vm = GlobalVueProps.world.map;
    const tile = this.tileAt({x, y});
    const backingCoords = this.worldToBackingMapCoords(x, y);

    vm[backingCoords.y][backingCoords.x] = tile?.toVue();
  }

  age(days = 1) {
    for (const tile of this.tiles) tile.age(days);
  }

  resetTilesVisited() {
    for (const tile of this.tiles) tile.visited = false;
  }
}