import { randomArrayElement, weightedRandomArrayElement } from "../util/random.js";
import GlobalVueProps from "../VueInterface.js";

const heroNames = {
  male: [
    'Arthur',
    'Brom',
    'Chauvanne',
    'Darius',
    'Elric',
    'Fabian',
    'Galahad',
    'Hector',
    'Icarus',
    'Jake',
    'Kenneth',
    'Lancelot',
    'Murtagh',
    'Nero',
    'Orion',
    'Percival',
    'Quinn',
    'Rhiannon',
    'Siegfried',
    'Tobias',
    'Ulric',
    'Valerian',
    'Wulfric',
    'Xerxes',
    'Yvain',
    'Zorro',
  ],
  female: [
    'Ariadne',
    'Beatrix',
    'Cassandra',
    'Diana',
    'Evangeline',
    'Fiona',
    'Gwen',
    'Helena',
    'Isolde',
    'Jaina',
    'Kara',
    'Luna',
    'Morgana',
    'Nimue',
    'Ophelia',
    'Persephone',
    'Quora',
    'Rachel',
    'Selene',
    'Thalia',
    'Ursula',
    'Vivian',
    'Willow',
    'Xanthe',
    'Ysolde',
    'Zara',
  ],
  'non-binary': [
    'Ang', // From SI units, named after "Angstrom", an extremely tiny unit of length.
    'Delta', // Greek: "change" or "difference"
    'Echo',
    'Flux',
    'Gray', // Neutral color, also an SI unit measuring harmful radiation dose.
    'Ihsan', // Arabic for "excellence" or "perfection"
    'Kai', // Japanese for "universe"
    'Mythos',
    'Nines', // From Nier: Automata, a phonetic nickname for the robot 9S.
    'Ohno', // What you say when you realize you've made a mistake.
    'Quest',
    'Rahma', // Arabic for "compassion" or "mercy"
    'Solidar',
    'Thaum', // From "Thaumaturgy", meaning "miracle-working" or "magic"
    'Ubuntu', // As in the African philosophy of shared humanity and community.
    'Volt',
    'Xen', // Pronounced "Zeen" as in "Xeno" meaning other or foreign.
    'Ygdrasil',
    'Zero', // From the MegaMan series, a robot hero.
  ],
};

const heroGenders = [
  'male',
  'female',
  'non-binary',
];

const heroGenderWeights = [
  50,
  50,
  1
];

export default class Hero {
  /** @type {string} The name of this hero. */ #name;
  /** @type {string} The gender of this hero. No gameplay effects, but alters some naming and dialogue text. */ #gender;
  /** @type {number} How far this hero can still move before the end of today. */ #stamina = 0;
  /** @type {number} How far this hero can move in a day. */ #maxStamina = 0;
  /** @type {number} The current level of this hero. */ #level = 1;
  /** @type {number} The current experience points of this hero. */ #xp = 0;
  /** @type {number} The experience points required for this hero to reach the next level. */ #xpToNextLevel = 10;

  get name() { return this.#name; }
  get gender() { return this.#gender; }
  get stamina() { return this.#stamina; }
  set stamina(value) { this.#stamina = value; this.updateVue(); }
  get maxStamina() { return this.#maxStamina; }
  set maxStamina(value) { this.#maxStamina = value; this.updateVue(); }
  get level() { return this.#level; }
  get xp() { return this.#xp; }
  set xp(value) { this.#xp = value; this.updateVue(); }
  get xpToNextLevel() { return this.#xpToNextLevel; }
  set xpToNextLevel(value) { this.#xpToNextLevel = value; this.updateVue(); }

  constructor(config) {
    if (config) {
      const { name, gender } = config;
      this.#name = name;
      this.#gender = gender;
    } else {
      this.randomize();
    }
  }

  static randomName(gender) {
    return randomArrayElement(heroNames[gender] ?? ['Unnamed Hero']);
  }

  randomize() {
    this.#gender = weightedRandomArrayElement(heroGenders, heroGenderWeights);
    this.#name = Hero.randomName(this.#gender);
  }

  /**
   * To be called when the hero rests for the night.
   * @mutates this.stamina Restores to maximum.
   * In future, this method will also heal some HP.
   */
  rest() { this.stamina = this.#maxStamina; }

  updateVue() {
    const vm = GlobalVueProps.hero;
    vm.stamina.current = this.#stamina;
    vm.stamina.max = this.#maxStamina;
    vm.xp.current = this.#xp;
    vm.xp.nextLevel = this.#xpToNextLevel;
  }
}