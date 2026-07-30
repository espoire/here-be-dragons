import { randomArrayElement, weightedRandomArrayElement } from "../util/random.js";

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
  /** @type {string} The name of this hero. */
  name;

  constructor(config) {
    if (config) {
      const { name, gender } = config;
      this.name = name;
      this.gender = gender;
    } else {
      this.randomize();
    }
  }

  static randomName(gender) {
    return randomArrayElement(heroNames[gender] ?? ['Unnamed Hero']);
  }

  randomize() {
    this.gender = weightedRandomArrayElement(heroGenders, heroGenderWeights);
    this.name = Hero.randomName(this.gender);
  }
}