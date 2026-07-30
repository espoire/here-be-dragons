/**
 * Utility data structure for storing and accessing a hexagonal tile map.
 * Provides tools like finding the neighbors of a tile, converting between axial and offset coordinates, and re-sizing the map.
 * 
 * @template TileType
 */
export default class HexTileMap {
  /** @type {TileType[][]} The 2d backing array for coordinate lookups. */
  #hexMap = [];
  get hexMap() { return this.#hexMap.map(row => [...row]); }

  /** @type {TileType[]} A flat view of the tiles, for iteration. */
  #tiles = [];
  /** @returns {TileType[]} A flat array of all the extant tile objects. */
  get tiles() { return [...this.#tiles]; }

  worldToBackingMapCoords(x, y) {
    return {
      x: x + this.#originOffsetInBackingMap.x,
      y: y + this.#originOffsetInBackingMap.y,
    };
  }

  /**
   * @param {number} x The world x-coordinate of the tile to retrieve.
   * @param {number} y The world y-coordinate of the tile to retrieve.
   * @returns {TileType?} The tile object at the given world coordinates, or a nullish value if no tile exists there.
   */
  tileAt({x, y}) {
    const b = this.worldToBackingMapCoords(x, y);
    return this.#hexMap[b.y]?.[b.x];
  }

  #origin = { x: 0, y: 0 };
  get origin() { return { ...this.#origin }; }
  #originOffsetInBackingMap = { x: 0, y: 0 };
  #radius = 0;
  get radius() { return this.#radius; }

  /**
   * @param {number} radius The positive whole number of tiles from the origin to the map edge, yielding a hexagonal grid of hex tiles.
   * @param {(x: number, y: number) => TileType} TileGenerator A function that takes axial coordinates and returns a new tile object.
   */
  constructor(radius, TileGenerator) {
    this.#radius = radius;
    this.#originOffsetInBackingMap = { x: radius, y: radius };

    for (let row = 0; row < 2 * radius + 1; row++) {
      const rowWidth = 2 * radius + 1 - Math.abs(radius - row);
      const rowOffset = Math.max(0, radius - row);
      this.#hexMap.push([]);
    
      for (let col = rowOffset; col < rowOffset + rowWidth; col++) {
        const x = col - this.#originOffsetInBackingMap.x;
        const y = row - this.#originOffsetInBackingMap.y;
        
        const node = TileGenerator(x, y);
    
        this.#tiles.push(node);
        this.#hexMap[row][col] = node;
      }
    }
  }

  /**
   * Gets the distance between two hex coordinates, using the cube coordinate system.
   * 
   * @param {number} x1 The axial x coordinate of the first hex.
   * @param {number} y1 The axial y coordinate of the first hex.
   * @param {number} x2 The axial x coordinate of the second hex.
   * @param {number} y2 The axial y coordinate of the second hex.
   */
  static hexDistance(x1, y1, x2, y2) {
    const z1 = -y1 - x1;
    const z2 = -y2 - x2;
    return (Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2)) / 2;
  }
}