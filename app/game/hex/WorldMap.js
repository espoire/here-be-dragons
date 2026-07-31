import GlobalVueProps from "../../VueInterface.js";
import HexTileMap from "./HexTileMap.js";
import WorldTile from "./WorldTile.js";

/**
 * A game state model class, which handles creating and updating the hex-grid world map.
 * @extends {HexTileMap<WorldTile>}
 */
export default class WorldMap extends HexTileMap {
  constructor(radius = 5) {
    super(
      radius,
      (x, y) => new WorldTile(x, y),
    );

    for (const tile of this.tiles) tile.age(10); // Age all tiles to create realistic correlations between neighboring tiles.
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

  resize(newRadius) {
    const { newTiles } = super.resize(newRadius, (x, y) => new WorldTile(x, y));
    for (const tile of newTiles) tile.age(10); // Age new tiles to make the old-edge discontinuity less visible.
    this.updateVue(); // Can't update only the new tiles, because the backing array has changed and the Vue map needs to be re-rendered.
  }
}