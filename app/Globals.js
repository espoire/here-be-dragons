/** @typedef {import("./game/GameController.js").default} GameController */

const Globals = {
  /** @type {GameController} */
  game: null,
};

window.expose('Globals', Globals);

export default Globals;