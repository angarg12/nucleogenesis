/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

let numberToElement = {};
for (let element in elements) {
  numberToElement[elements[element].number] = element;
  let isotopes = elements[element].isotopes;
  for (let isotope in isotopes) {
    if (isotopes[isotope].ratio === 0) {
      if (!isDecayProduct(isotope) && !isFusionProduct(isotope)) {
        throw new Error(isotope, 'cannot be obtained.');
      }
    }
  }
}

function isDecayProduct(isotope) {
  for (let key in resources) {
    let resource = resources[key];
    if (resource.decay) {
      for (let typeKey in resource.decay.decay_types) {
        let type = resource.decay.decay_types[typeKey];
        if (type.reaction.product[isotope]) {
          return true;
        }
      }
    }
  }
  return false;
}

function isFusionProduct(isotope) {
  let number = parseInt(isotope, 10);
  let element = isotope.replace(number, '');
  let elementNumber = elements[element].number;
  for (let i = 1; i < elementNumber; i++) {
    let elem1 = numberToElement[i];
    let elem2 = numberToElement[elementNumber - i];
    for (let iso1 in elements[elem1].isotopes) {
      for (let iso2 in elements[elem2].isotopes) {
        let num1 = parseInt(iso1, 10);
        let num2 = parseInt(iso2, 10);
        if (num1 + num2 === number) {
          return true;
        }
      }
    }
  }
  return false;
}
