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
        
        const tile = TileGenerator(x, y);
    
        this.#tiles.push(tile);
        this.#hexMap[row][col] = tile;
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

  /**
   * @param {number} newRadius The positive whole number of tiles from the origin to the map edge, yielding a hexagonal grid of hex tiles.
   * @param {(x: number, y: number) => TileType} TileGenerator A function that takes axial coordinates and returns a new tile object.
   * 
   * Resizes the hex map to the new radius.
   * If the newRadius is smaller, discards tiles outside the old radius.
   * If the newRadius is larger, generates new tiles to fill in the additional spaces using the TileGenerator function.
   * 
   * @returns {{ newTiles: TileType[], translation: { x: number, y: number } }}
   * newTiles is a flat array of the newly generated tiles that were added to the map. Empty, for a size reduction.
   * translation is the offset that should be applied to any existing backing-map coordinates to map them into the new coordinate system.
   * 
   * Note: The Hero's position or anything else stored as world coordinates does not need to be adjusted; world coordinates are preserved.
   */
  resize(newRadius, TileGenerator) {
    // Generate new rectangular backing array
    const newHexMap = [];
    const newTiles = [];
    const addedTiles = [];
    const newOriginOffsetInBackingMap = { x: newRadius, y: newRadius };
    const translation = {
      x: newOriginOffsetInBackingMap.x - this.#originOffsetInBackingMap.x,
      y: newOriginOffsetInBackingMap.y - this.#originOffsetInBackingMap.y,
    };

    for (let row = 0; row < 2 * newRadius + 1; row++) {
      const rowWidth = 2 * newRadius + 1 - Math.abs(newRadius - row);
      const rowOffset = Math.max(0, newRadius - row);
      newHexMap.push([]);
    
      for (let col = rowOffset; col < rowOffset + rowWidth; col++) {
        const x = col - newOriginOffsetInBackingMap.x;
        const y = row - newOriginOffsetInBackingMap.y;

        const isInsideOldRadius = HexTileMap.hexDistance(x, y, this.#origin.x, this.#origin.y) <= this.#radius;
        if (isInsideOldRadius) {
          // Copy-forward the existing tile from the old backing array
          const tile = this.tileAt({ x, y });
          newHexMap[row][col] = tile;
          newTiles.push(tile);

        } else {
          // Generate new tiles for any new coordinates that are now within the new radius
          const tile = TileGenerator(x, y);
          
          newHexMap[row][col] = tile;
          newTiles.push(tile);
          addedTiles.push(tile);
        }
      }
    }

    // Replace this.#hexMap with the new backing array
    this.#hexMap = newHexMap;
    this.#tiles = newTiles;

    // Update this.#radius and this.#originOffsetInBackingMap to reflect the new radius
    this.#radius = newRadius;
    this.#originOffsetInBackingMap = newOriginOffsetInBackingMap;

    return { newTiles: addedTiles, translation };
  }
}