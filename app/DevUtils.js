import Globals from "./Globals.js";

class DevUtils {
  static ageMap(days = 1) {
    const map = Globals.game?.worldMap;
    if (!map) return;
    map.age(days);
    map.updateVue();
  }
}

window.expose('DevUtils', DevUtils);