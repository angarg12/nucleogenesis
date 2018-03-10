/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

let isotopeMatrix = {};

function getAtomBreakdown(isotope) {
  let element = isotope.replace(/^[0-9]*/, '');
  let number = parseInt(isotope.replace(element, ''), 10);
  let elementNumber = elements[element].number;
  let neutronNumber = number - elementNumber;
  return {
    atom: elementNumber,
    n: neutronNumber
  };
}

for (let element in elements) {
  for (let isotope in elements[element].isotopes) {
    let breakdown = getAtomBreakdown(isotope);
    if (!isotopeMatrix[breakdown.atom]) {
      isotopeMatrix[breakdown.atom] = {};
    }
    isotopeMatrix[breakdown.atom][breakdown.n] = isotope;
  }
}

for (let element in elements) {
  for (let key in elements[element].isotopes) {
    let isotope = resources[key];
    if (isotope.decay) {
      let ratioSum = 0;
      for (let decay in isotope.decay.decay_types) {
        ratioSum += isotope.decay.decay_types[decay].ratio;
        isotope.decay.decay_types[decay].reaction = generateReaction(key, decay);
      }
      let difference = 1 - ratioSum;
      if (Math.abs(difference) > 1e-7) {
        throw new Error('Ratios add up to '.concat(1 - difference, ' for ', key));
      }
    }
  }
}

function generateReaction(isotope, type) {
  switch (type) {
  case 'beta-':
    return calculateReaction(isotope, 1, 'e-', 1, 0);
  case '2beta-':
    return calculateReaction(isotope, 2, 'e-', 2, 0);
  case 'beta+':
    return calculateReaction(isotope, 1, 'e+', -1, 0);
  case '2beta+':
    return calculateReaction(isotope, 2, 'e+', -2, 0);
  case 'electron_capture':
    return calculateReaction(isotope, 1, null, -1, 0);
  case 'alpha':
    return calculateReaction(isotope, 1, 'He2+', -2, -4);
  case 'beta+p':
    return calculateReaction(isotope, 1, 'e-', -2, -1);
  case 'beta-n':
    return calculateReaction(isotope, 1, 'e+', 1, -1);
  case 'SF':
    return calculateSF(isotope);
  default:
    throw new Error('Unrecognized decay type: ' + type);
  }
}

function calculateReaction(isotope, number, particle, protonDifference, isotopeDifference) {
  let element = isotope.replace(/^[0-9]*/, '');
  let elementNumber = elements[element].number - 1;
  let listElements = Object.keys(elements);
  let otherElement = listElements[elementNumber + protonDifference];

  let isotopeNumber = Number(isotope.replace(element, '')) + isotopeDifference;
  let product = isotopeNumber + otherElement;

  // We need all this convoluted logic to work around missing isotopes in the data set
  // essentially we look for the closest isotope to the target one, and consume/produce
  // free neutrons in the process
  let distance = 0;
  if (!resources[product]) {
    let candidate = null;
    // first we start looking for lighter isotopes
    for (let otherNumber = isotopeNumber; otherNumber > 0; otherNumber--) {
      let otherProduct = otherNumber + otherElement;
      if (resources[otherProduct]) {
        candidate = otherProduct;
        distance = isotopeNumber - otherNumber;
        break;
      }
    }
    // pay attention to the upper bound. 300 is bigger than any known isotope, so it is safe
    for (let otherNumber = isotopeNumber; otherNumber < 300; otherNumber++) {
      let otherProduct = otherNumber + otherElement;
      if (resources[otherProduct]) {
        // we only replace the candidate if the distance is smaller
        if (isotopeNumber - otherNumber < Math.abs(distance)) {
          candidate = otherProduct;
          distance = isotopeNumber - otherNumber;
        }
        break;
      }
    }
    if (!candidate) {
      throw new Error('No candidate found for ' + isotope + ' replacing the missing isotope ' + product);
    }
    product = candidate;
  }
  let energy = resources[isotope].energy - resources[product].energy;
  if (distance < 0) {
    energy -= resources.n.energy * distance;
  }

  let reaction = {};
  reaction.reactant = {};
  reaction.reactant[isotope] = number;
  // if the isotope is heavier, the distance is negative and we produce neutrons
  if (distance < 0) {
    reaction.reactant.n = Math.abs(distance);
  }
  reaction.product = {};
  reaction.product[product] = number;
  if (particle) {
    reaction.product[particle] = number;
  }
  // if the isotope is lighter, the distance is positive and we produce neutrons
  if (distance > 0) {
    reaction.product.n = distance;
  }
  reaction.product.eV = energy;

  return reaction;
}

function calculateSF(isotope) {
  let breakdown = getAtomBreakdown(isotope);
  let halfNeutron = Math.floor(breakdown.n / 2);
  let halfAtom = Math.floor(breakdown.atom / 2);
  let firstHalf;
  for (let i = halfNeutron; i > 0; i--) {
    if (isotopeMatrix[halfAtom][i]) {
      firstHalf = isotopeMatrix[halfAtom][i];
      break;
    }
  }
  let secondHalfNeutron = breakdown.n - halfNeutron;
  let secondHalfAtom = breakdown.atom - halfAtom;

  let secondHalf;
  for (let i = secondHalfNeutron; i > 0; i--) {
    if (isotopeMatrix[secondHalfAtom][i]) {
      secondHalf = isotopeMatrix[secondHalfAtom][i];
      break;
    }
  }
  let firstHalfBreakdown = getAtomBreakdown(firstHalf);
  let secondHalfBreakdown = getAtomBreakdown(secondHalf);
  let neutronExcess = breakdown.n - firstHalfBreakdown.n - secondHalfBreakdown.n;

  let energy = resources[isotope].energy - resources[firstHalf].energy -
    resources[secondHalf].energy - resources.n.energy * neutronExcess;

  let reaction = {};
  reaction.reactant = {};
  reaction.reactant[isotope] = 1;
  reaction.product = {};
  reaction.product[firstHalf] = 1;
  reaction.product[secondHalf] = reaction.product[secondHalf]+1 || 1;
  if (neutronExcess > 0) {
    reaction.product.n = neutronExcess;
  }
  if (energy > 0) {
    reaction.product.eV = energy;
  }
  return reaction;
}

jsonfile.writeFileSync('build/data/resources.json', resources, {
  spaces: 2
});

jsonfile.writeFileSync('build/data/elements.json', elements, {
  spaces: 2
});
