import { randomArrayElement } from '../../../util/random.js';

const titleMessages = [
  'Proof of Concept',
];

export function getEpithet() {
  return randomArrayElement(titleMessages);
}
