import data from './data.json';

import { getRandomInt, shuffleArray } from '../../Helpers';

function getRandomDatom() {
  const values = Object.values(data);
  return values[getRandomInt(values.length)];
}

function getRandomAsset(datom) {
  return datom.assets[getRandomInt(3)];
}

function getFourRandomDatoms(datom) {
  let names = [];
  const values = Object.values(data);
  for (let _ = 0; _ < 3; _++) {
    names.push({ ...values[getRandomInt(values.length)], disabled: false });
  }
  names.push({ ...datom, disabled: false });
  return shuffleArray(names);
}

export { getRandomDatom, getRandomAsset, getFourRandomDatoms };
