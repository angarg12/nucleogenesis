/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0] + '/data/resources.json');
let elements = jsonfile.readFileSync(args[0] + '/data/elements.json');

for (let key in resources) {
  let resource = resources[key];
  if(resource.type.indexOf('isotope') === -1){
    continue;
  }
  if (resource.decay) {
    let ratioSum = 0;
    for (let decay in resource.decay.decay_types) {
      ratioSum += resource.decay.decay_types[decay].ratio;
      resource.decay.decay_types[decay].reaction = generateReaction(key, decay);
    }
    let difference = 1 - ratioSum;
    if (Math.abs(difference) > 1e-6) {
      throw new Error('Ratios add up to '.concat(1 - difference, ' for ', key));
    }
  }
}

function generateReaction(isotope, type) {
  switch (type) {
  case 'beta-':
    return calculateReaction(isotope, 1, 'e-');
  case '2beta-':
    return calculateReaction(isotope, 2, 'e-');
  case 'beta+':
    return calculateReaction(isotope, -1, 'e+');
  case 'electron_capture':
    return calculateReaction(isotope, -1, null);
  default:
    throw new Error('Unrecognized decay type: ' + type);
  }
}

function calculateReaction(isotope, number, particle) {
  let element = isotope.replace(/^[0-9]*/, '');
  let elementNumber = elements[element].number-1;
  let listElements = Object.keys(elements);
  let other_element = listElements[elementNumber + number];

  let isotopeNumber = isotope.replace(element, '');
  let product = isotopeNumber + other_element;

  let energy = resources[isotope].energy - resources[product].energy;

  let reaction = {};
  reaction.reactant = {};
  reaction.reactant[isotope] = Math.abs(number);
  reaction.product = {};
  reaction.product[product] = Math.abs(number);
  if(particle){
    reaction.product[particle] = Math.abs(number);
  }
  reaction.product.eV = energy;

  return reaction;
}

jsonfile.writeFileSync(args[0] + '/data/resources.json', resources, {
  spaces: 2
});
