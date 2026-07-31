import HexTileMap from "../../../app/game/hex/HexTileMap.js";
import { errorMaybe, runFunctionalTests } from "../../TestHelpers.js";

export function runAllHexTileMapTests() {
  runFunctionalTests('HexTileMap', [
    _testResizeHexTileMap,
  ]);
}

function _testResizeHexTileMap() {
  const errors = [];

  const generatorFn = (x, y) => ({x, y});
  const map = new HexTileMap(1, generatorFn); // Radius 1, so should contain 7 tiles.
  const initialHexMap = map.hexMap;
  const initialTiles = map.tiles;

  if (!hexMapEquals(map.hexMap, [
    [null, {x: 0, y: -1}, {x: 1, y: -1}],
    [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0}],
    [{x: -1, y: 1}, {x: 0, y: 1}]
  ])) {
    errors.push('Initial hex tile map does not match expected structure.');
  }

  const { newTiles, translation } = map.resize(2, generatorFn); // Resize to radius 2, should add 12 new tiles.

  // Confirm new tiles contains 12 tiles, none of which are in the initial tiles.
  if (newTiles.length !== 12) {
    errors.push(`Expected 12 new tiles, but got ${newTiles.length}.`);
  }
  for (const tile of newTiles) {
    if (initialTiles.some(t => t.x === tile.x && t.y === tile.y)) {
      errors.push('New tile is already in the initial tiles: ' + JSON.stringify(tile));
    }
  }

  // Confirm expected (1, 1) translation for radius 1 --> 2.
  if (translation.x !== 1 || translation.y !== 1) {
    errors.push(`Expected translation of (1, 1), but got (${translation.x}, ${translation.y}).`);
  }

  // Confirm the new hexMap structure matches the expected structure for radius 2.
  if (!hexMapEquals(map.hexMap, new HexTileMap(2, generatorFn).hexMap)) {
    errors.push('Resized hex tile map does not match expected structure for radius 2.');
  }

  // Resize back to radius 1 and confirm the hexMap structure matches the original structure.
  const result2 = map.resize(1, generatorFn);
  if (!hexMapEquals(map.hexMap, initialHexMap)) {
    errors.push('Hex tile map after resizing back to radius 1 does not match the original structure.');
  }

  // Confirm that no new tiles were added when resizing back to the original radius.
  if (result2.newTiles.length !== 0) {
    errors.push(`Expected no new tiles when resizing back to radius 1, but got ${result2.newTiles.length}.`);
  }

  // Confirm expected (-1, -1) translation for radius 2 --> 1.
  if (result2.translation.x !== -1 || result2.translation.y !== -1) {
    errors.push(`Expected translation of (-1, -1) when resizing back to radius 1, but got (${result2.translation.x}, ${result2.translation.y}).`);
  }

  errorMaybe('HexTileMap resize tests', errors);
  return { cases: 1, errors };
}

/**
 * @param map1 {({ x: number, y: number } | undefined)[][]}
 * @param map2 {({ x: number, y: number } | undefined)[][]}
 * 
 * Verifies whether two 2D arrays of tile objects are equal in terms of their structure and the x/y coordinates of the tiles they contain.
 * Both maps must be rectangular arrays of the same dimensions, and each corresponding tile object must have the same x/y coordinates,
 * and neither map may contain any tile objects absent from the other map. Nullish locations in either map must be either nullish or absent in the other map.
 * 
 * @returns {boolean} True if the two maps are equal, false otherwise.
 */
function hexMapEquals(map1, map2) {
  if (map1.length !== map2.length) return false;
  for (let row = 0; row < map1.length; row++) {
    if (map1[row].length !== map2[row].length) return false;
    for (let col = 0; col < map1[row].length; col++) {
      const tile1 = map1[row][col];
      const tile2 = map2[row][col];
      if (!tile1 && !tile2) continue; // Both are nullish, so they are equal
      if (!tile1 || !tile2) return false; // One is nullish and the other is not, so they are not equal
      if (tile1.x !== tile2.x || tile1.y !== tile2.y) return false; // Both are non-nullish, but their coordinates differ, so they are not equal
    }
  }
  return true;
}
