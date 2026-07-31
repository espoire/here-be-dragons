import Globals from "../Globals.js";
import Settings from "../Settings.js";
import Guild from "./Guild.js";

const definitions = [{
  id: 'guild-hall',
  name: 'Guild Hall',
  description: 'Erect the Guild Hall',
  justificationText: 'Provides a permanent headquarters for Guild operations.',
  benefitText: 'Prerequisite for many other constructions.',
  onComplete: null, // No run-once function, for now.
  completionComment: 'At last I lay down my blade, the Guild shall guard this world now.',
  materials: {
    coin: 20,
    stone: 10,
    wood: 5,
    ore: 2,
    cloth: 2,
  },
}, {
  id: 'quartermaster-1',
  prerequisite: 'guild-hall',
  name: 'Hero Payroll',
  description: 'Hire a Guild Payroll Clerk',
  justificationText: 'Ensure that Heroes are compensated for their efforts in a timely manner.',
  benefitText: 'The Guild Payroll Clerk allocates to Heroes returning before nightfall: 1 Coin.',
  onComplete: null, // No run-once function; completeness is checked by quartermaster.js to decide whether to give the 1 Coin benefit.
  completionComment: 'I am glad to be paid for my work, but I would do this regardless.',
  materials: {
    coin: 25,
  },
}, {
  id: 'quartermaster-2',
  prerequisite: 'quartermaster-1',
  name: 'Quartermaster',
  description: 'Construct a Guild Storehouse & Hire a Quartermaster',
  justificationText: "Manages the Guild's growing inventory of resources and supplies.",
  benefitText: 'The Quartermaster allocates to Heroes returning before nightfall: an additional resource of up to 2 types gathered during their expedition, replacing the nightly 1 Coin allowance.',
  onComplete: null, // No run-once function; completeness is checked by quartermaster.js to decide whether to give the bonus items benefit.
  completionComment: 'About time, I was getting tired of someone "misplacing" a bit of everything I brought home.',
  materials: {
    coin: 10,
    wood: 8,
    stone: 5,
    herbs: 5,
    ore: 2,
  },
}, {
  id: 'training-grounds-1',
  prerequisite: 'guild-hall',
  name: 'Training Grounds',
  description: 'Construct a Guild Training Grounds',
  justificationText: 'Provides a safe and controlled environment for new Guild recruits to train and hone their skills.',
  benefitText: 'New Heroes begin their service with 2 XP.',
  onComplete() { Guild.newHeroXp += 2; },
  completionComment: 'I wonder who will teach? Maybe I will volunteer when I retire from adventuring.',
  materials: {
    coin: 5,
    wood: 10,
    stone: 2,
  },
}, {
  id: 'training-grounds-2',
  prerequisites: ['training-grounds-1', 'max-stamina-1'],
  name: 'Recruit Trainer',
  description: 'Hire a Full-Time Guild Recruit Trainer',
  justificationText: 'Provides dedicated training so new Guild Recruits are well-prepared for their adventures.',
  benefitText: 'New Heroes begin their service with 1 additional XP.',
  onComplete() { Guild.newHeroXp += 1; },
  completionComment: "It's about time the instructor got paid.",
  materials: {
    coin: 50,
    paper: 2,
  },
}, {
  id: 'max-stamina-1',
  prerequisite: 'guild-hall',
  name: 'Dormitory',
  description: 'Construct a Dormitory for the Guild Adventurers',
  justificationText: 'Provides a safe and comfortable place for Guild members to rest and recover after their adventures.',
  benefitText: 'All Heroes gain +2 maximum stamina.', // For a total of 12
  onComplete() { Guild.newHeroStamina += 2; Globals.game.hero.maxStamina += 2; },
  completionComment: 'I hope the beds are better than at the tavern.',
  materials: {
    coin: 10,
    herbs: 8,
    wood: 6,
    stone: 4,
    cloth: 1,
  },
}, {
  id: 'max-stamina-2',
  prerequisite: 'max-stamina-1',
  name: "Cobbler's Office",
  description: 'Hire a Full-Time Cobbler for the Guild & Construct a Guild Boot Workshop',
  justificationText: "Provides a dedicated cobbler to maintain and repair the Guild members' boots, ensuring they are always ready for adventure.",
  benefitText: 'All Heroes gain +1 maximum stamina.', // For a total of 13
  onComplete() { Guild.newHeroStamina += 1; Globals.game.hero.maxStamina += 1; },
  completionComment: "My coin purse shall ne'er again be burdened with the price of so many boots. ...wait, the Guild boots ARE going to be free, right?",
  materials: {
    coin: 25,
    leather: 2,
    cloth: 1,
    wood: 10,
    stone: 2,
  },
}, {
  id: 'max-stamina-3',
  prerequisites: ['quartermaster', 'max-stamina-2'],
  name: 'Boot Stockpile',
  description: 'Expand the Storehouse to Amass a Strategic Boot Stockpile',
  justificationText: 'Ensures the Guild has a sufficient supply of boots for all Heroes.',
  benefitText: 'All Heroes gain +1 maximum stamina.', // For a total of 14
  onComplete() { Guild.newHeroStamina += 1; Globals.game.hero.maxStamina += 1; },
  completionComment: 'No more trading favors to reach the front of the boot queue.',
  materials: {
    coin: 100,
    leather: 10,
    cloth: 2,
    wood: 10,
    stone: 2,
  },
}, {
  id: 'max-stamina-4',
  prerequisites: ['max-stamina-3', 'map-radius-3'],
  name: 'Boot Inventory',
  description: 'Assess the Guild Boot Inventory & Keep Written Records Thereof',
  justificationText: 'Ensures efficient deployment and adequate supply of boots for all Guild Heroes.',
  benefitText: 'All Heroes gain +1 maximum stamina.', // For a total of 15
  onComplete() { Guild.newHeroStamina += 1; Globals.game.hero.maxStamina += 1; },
  completionComment: 'I am curious where all those missing boots went. To whomever reads these: let me know if we find out?',
  materials: {
    coin: 200,
    paper: 15,
    wood: 4,
  },
}, {
  id: 'map-radius-1',
  prerequisite: 'guild-hall',
  name: 'Scouting Office',
  description: 'Construct & Staff a Scouting Office',
  justificationText: 'Enables the Guild to remain informed about the surrounding territories.',
  benefitText: 'Guild Heroes may adventure 1 additional tile farther afield.',
  onComplete() { Guild.mapRadius += 1; },
  completionComment: 'I wonder what mysteries await us beyond the horizon?',
  materials: {
    coin: 10,
    herbs: 6,
    wood: 10,
    stone: 2,
  },
}, {
  id: 'map-radius-2',
  prerequisite: 'map-radius-1', // TODO: auto-convert to array, accept `prerequisite` or `prerequisites` equivalently, do not show in available construction options until all prerequisite constructions are complete
  name: 'Scouting Office Expansion',
  description: 'Expand the Scouting Office',
  justificationText: 'Provides additional space and resources for expanding Scouting head count.',
  benefitText: 'Guild Heroes may adventure 2 additional tiles farther afield.',
  onComplete() { Guild.mapRadius += 2; },
  completionComment: 'The Guild is growing, and so is our reach into the unknown.',
  materials: {
    coin: 50,
    wood: 20,
    stone: 4,
  },
}, {
  id: 'map-radius-3',
  prerequisites: ['map-radius-2', 'quartermaster'],
  name: 'Paper Supplier & Stockpile',
  description: 'Establish a Guild Paper Supplier & Stockpile',
  justificationText: 'Ensures the Guild has a sufficient supply of paper for maps, reports, and other documentation, meet rising demand from the Scouting Office for map-making.',
  benefitText: 'Guild Heroes may adventure 3 additional tiles farther afield.',
  onComplete() { Guild.mapRadius += 3; },
  completionComment: 'As the only recruit of my cohort who did not receive a copy of our map when I enlisted: about time!',
  materials: {
    coin: 100,
    paper: 10,
    wood: 20,
    stone: 4,
  },
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
  /** @type {function?} A function to run once when this construction is completed, to apply its benefit. */ onComplete;
  /** @type {string} The comment text the hero writes in the margins of the nightly report, when this construction is completed. */ completionComment;
  /** @type {{ [resourceType: string]: number }} The materials required for this construction. */ materials;

  /** @type {{ [resourceType: string]: number }} The progress of materials collected for this construction, corresponding to the materials array. */ materialsProgress = {};
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

  constructor({ id, name, description, justificationText, benefitText, onComplete, completionComment, materials }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.justificationText = justificationText;
    this.benefitText = benefitText;
    this.onComplete = onComplete;
    this.completionComment = completionComment;

    materials = Settings.test.easyConstructions ? { coin: 1 } : materials;
    this.materials = materials;

    // Prefill the materialsProgress object with zeros for each material.
    for (const id in materials) this.materialsProgress[id] = 0;
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

    for (const id in this.materials) {
      const amount = this.materials[id];
      const available = resources[id] ?? 0;
      const needed = amount - (this.materialsProgress[id] ?? 0);
      const toTurnIn = Math.min(available, needed);

      if (toTurnIn > 0) {
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
    
    for (const id in this.materials) {
      const amount = this.materials[id];
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
    if (typeof this.onComplete === 'function') this.onComplete();
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

  toVue() {
    return {
      id: this.id,
      name: this.name,
      materials: { ...this.materials }, // Clone to avoid Vue-proxying the main game data object.
      materialsProgress: { ...this.materialsProgress }, // Clone to avoid Vue-proxying the main game data object.
    };
  }
}

Construction.loadDefinitions();