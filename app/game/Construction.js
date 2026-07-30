import Globals from "../Globals.js";
import Settings from "../Settings.js";
import Guild from "./Guild.js";

const definitions = [{
  id: 'guild-hall',
  name: 'Guild Hall',
  description: 'Erect the Guild Hall',
  justificationText: 'Provides a permanent headquarters for Guild operations.',
  benefitText: 'Members returning before nightfall receive 1 Coin.',
  benefit: null, // No run-once function; completeness is checked by quartermaster.js to decide whether to give the 1 Coin benefit.
  completionComment: 'At last I lay down my blade, the Guild shall guard this world now.',
  materials: [
    { id: 'coin', amount: 50 },
    { id: 'stone', amount: 20 },
    { id: 'wood', amount: 10 },
    { id: 'ore', amount: 4 },
    { id: 'cloth', amount: 4 },
  ],
}, {
  id: 'quartermaster',
  name: 'Quartermaster',
  description: 'Construct a Guild Storehouse & Hire a Quartermaster',
  justificationText: "Manages the Guild's growing inventory of resources and supplies.",
  benefitText: 'The Quartermaster allocates to Heroes returning before nightfall: an additional resource of up to 2 types gathered during their expedition, replacing the nightly 1 Coin allowance.',
  benefit: null, // No run-once function; completeness is checked by quartermaster.js to decide whether to give the bonus items benefit.
  completionComment: 'About time, I was getting tired of someone "misplacing" a bit of everything I brought home.',
  materials: [
    { id: 'coin', amount: 10 },
    { id: 'wood', amount: 8 },
    { id: 'stone', amount: 5 },
    { id: 'herbs', amount: 5 },
    { id: 'ore', amount: 2 },
  ],
}, {
  id: 'training-grounds',
  name: 'Training Grounds',
  description: 'Construct a Guild Training Grounds',
  justificationText: 'Provides a safe and controlled environment for new Guild recruits to train and hone their skills.',
  benefitText: 'New Heroes begin their service with 2 XP.',
  benefit: () => { Guild.newHeroXp += 2; },
  completionComment: 'I wonder who will teach? Maybe I will volunteer when I retire from adventuring.',
  materials: [
    { id: 'coin', amount: 5 },
    { id: 'wood', amount: 10 },
    { id: 'stone', amount: 2 },
  ],
}, {
  id: 'dormitory',
  name: 'Dormitory',
  description: 'Construct a Dormitory for the Guild Adventurers',
  justificationText: 'Provides a safe and comfortable place for Guild members to rest and recover after their adventures.',
  benefitText: 'All Heroes gain +2 maximum stamina.',
  benefit: () => { Guild.newHeroStamina += 2; Globals.game.hero.maxStamina += 2; },
  completionComment: 'I hope the beds are better than at the tavern.',
  materials: [
    { id: 'coin', amount: 10 },
    { id: 'herbs', amount: 8 },
    { id: 'wood', amount: 6 },
    { id: 'stone', amount: 4 },
    { id: 'cloth', amount: 2 },
  ],
}, {
  id: 'scouts',
  name: 'Scouting Office',
  description: 'Construct & Staff a Scouting Office',
  justificationText: 'Enables the Guild to remain informed about the surrounding territories.',
  benefitText: 'Guild Heroes may adventure 1 additional tile farther afield.',
  benefit: () => { Guild.mapRadius += 1; },
  completionComment: 'I wonder what mysteries await us beyond the horizon?',
  materials: [
    { id: 'coin', amount: 10 },
    { id: 'herbs', amount: 6 },
    { id: 'wood', amount: 10 },
    { id: 'stone', amount: 2 },
  ],
}];

export default class Construction {
  /** @type {Map<string, Construction>} */
  static #byId = new Map();
  /** @type {Construction[]} */
  static #list = [];

  static loadDefinitions() {
    if (this.#list.length) return;
    for (const def of definitions) {
      const construction = new Construction(def);
      construction.index = this.#list.length;

      this.#byId.set(construction.id, construction);
      this.#list.push(construction);
    }
  }

  /**
   * @param {string} id The programmatic ID of the construction to retrieve.
   * @returns {Construction?} The construction with the given ID, or null if no such construction exists.
   */
  static getById(id) {
    return this.#byId.get(id);
  }

  /**
   * @param {number} index The numeric index of the construction to retrieve, in the order they were defined.
   * @returns {Construction?} The construction at the given index, or null if no such construction exists.
   */
  static getByIndex(index) {
    return this.#list[index];
  }

  /** @returns {number} The maximum valid index for constructions. */
  static get maxIndex() {
    return this.#list.length;
  }

  /** @returns {boolean} Whether the given ID corresponds to a valid construction. */
  static isValidId(id) {
    return this.#byId.has(id);
  }

  /** @returns {Construction[]} All constructions which are not already completed. In future, will also check prerequisites. */
  static getAvailableConstructions() {
    return this.#list.filter(construction => !construction.completed);
  }

  /**
   * @param {string} constructionId The programmatic ID of the construction to check.
   * @returns {boolean?} True if the construction is complete, false if not, or null if the construction ID is invalid.
   */
  static isComplete(constructionId) {
    const construction = this.getById(constructionId);
    return construction?.completed;
  }

  /** @type {number} */ index;
  /** @type {string} The textual programmatic ID of this construction. */ id;
  /** @type {string} The name of this construction, as displayed on the during-exploration "current goal" HUD. */ name;
  /** @type {string} The name of this construction, as displayed on the construction requisition form's "Project" field. */ description;
  /** @type {string} The justification text of this construction, as displayed on the construction requisition form's "Justification" field. */ justificationText;
  /** @type {string} The benefit text of this construction, as displayed on the construction requisition form's "Expected Benefit" field. */ benefitText;
  /** @type {string} The comment text the hero writes in the margins of the nightly report, when this construction is completed. */ completionComment;
  /** @type {{ id: string, amount: number }[]} The materials required for this construction. */ materials;

  /** @type {Object<string, number>} The progress of materials collected for this construction, corresponding to the materials array. */ materialsProgress = {};
  /** @type {string?} The name of the player's active hero at the time this construction was initiated, or null if construction not yet begun. Displayed on the form. */ assigneeName = null;
  /** @type {string?} The generated NPC name of the fictional Guild bureaucrat who approved this construction, or null if construction not yet begun. Displayed on the form. */ approverName = null;
  /** @type {string?} The name of the player's hero who handed in the final needed resource, or null if construction not yet complete. To some day be displayed on historical forms. */ finisherName = null;
  /** @type {number?} */ startedDay = null;
  /** @type {number?} */ completedDay = null;

  // To query whether this construction is currently active, refer the guild's activeConstructionId property.

  /** @returns {boolean} Whether this construction has ever been active, which modifies the form to re-activate it. */
  get wasActive() { return this.startedDay != null; }
  /** @type {boolean} Whether this construction has been completed. */
  get completed() { return this.completedDay != null; }

  constructor({ id, name, description, justificationText, benefitText, completionComment, materials }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.justificationText = justificationText;
    this.benefitText = benefitText;
    this.completionComment = completionComment;

    materials = Settings.test.easyConstructions ? [{ id: 'coin', amount: 1 }] : materials;
    this.materials = materials;

    // Prefill the materialsProgress object with zeros for each material.
    for (const { id } of materials) this.materialsProgress[id] = 0;
  }

  /**
   * @param {Object<string, number>} resources A map <resourceId, amountAvailable> of the available resource stocks, to take resources from.
   * @mutates the resources object to remove the resources that were turned in.
   * @mutates this.materialsProgress to add the resources that were turned in.
   * @mutates this.completedDay if the construction is completed by this turn's resource turn-in.
   * @returns {Object<string, number>?} A non-empty map <resourceId, amountTurnedIn> of the resources that were turned in for this construction, or null if no resources were turned in.
   */
  turnInResources(resources) {
    const turnedIn = {};
    let turnedInAny = false;

    for (const { id, amount } of this.materials) {
      const available = resources[id] ?? 0;
      const needed = amount - (this.materialsProgress[id] ?? 0);
      const toTurnIn = Math.min(available, needed);

      if (toTurnIn > 0) {
        resources[id] = available - toTurnIn;
        this.materialsProgress[id] = (this.materialsProgress[id] ?? 0) + toTurnIn;
        turnedIn[id] = toTurnIn;
        turnedInAny = true;
      }
    }

    return turnedInAny ? turnedIn : null;
  }

  /**
   * Checks whether the construction is complete, and if so, sets the completedDay property to the current day.
   * @param {number} day The current day, to set as completedDay if the construction is complete.
   * @param {string} currentHeroName The name of the hero currently completing the construction.
   * @mutates this.completedDay if the construction is completed by this turn's resource turn-in.
   * @returns {boolean} Whether the construction is now complete.
   * 
   * No-op if the construction is already complete. Reacting to the completion of the construction is the caller's responsibility.
   */
  completeMaybe(day, currentHeroName) {
    if (this.completed) return true;
    
    for (const { id, amount } of this.materials) {
      if ((this.materialsProgress[id] ?? 0) < amount) return false;
    }

    this.#complete(day, currentHeroName);
    return true;
  }

  /**
   * @param {number} day
   * @param {string} currentHeroName
   * @mutates this.completedDay
   * @mutates this.finisherName
   * @private
   */
  #complete(day, currentHeroName) {
    this.completedDay = day;
    this.finisherName = currentHeroName;
  }

  /**
   * @param {number} day
   * @param {string} assigneeName 
   * @param {string} approverName 
   */
  activate(day, assigneeName, approverName) {
    this.assigneeName = assigneeName;
    this.approverName = approverName;
    this.startedDay = day;
  }
}

Construction.loadDefinitions();