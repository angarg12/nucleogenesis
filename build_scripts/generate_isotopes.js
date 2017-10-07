/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');
let radioisotopes = [];

for (let element in elements) {
  elements[element].includes = elements[element].includes || [];
  let exotic = 'x' + element;
  elements[element].exotic = exotic;

  resources[exotic] = {};
  resources[exotic].elements = {};
  resources[exotic].elements[element] = 1;
  resources[exotic].type = ['exotic'];

  let isotopes = elements[element].isotopes;
  let ratioSum = 0;
  let mainIsotope = [0, ''];
  for (let isotope in isotopes) {
    resources[isotope] = {};
    resources[isotope].energy = isotopes[isotope].energy;
    resources[isotope].elements = {};
    resources[isotope].elements[element] = 1;
    resources[isotope].html = isotopePrefix(isotope) + element;
    resources[isotope].decay = isotopes[isotope].decay;
    resources[isotope].type = ['isotope'];

    delete isotopes[isotope].decay;

    if (elements[element].includes.indexOf(isotope) === -1) {
      elements[element].includes.push(isotope);
    }

    ratioSum += isotopes[isotope].ratio;
    if (isotopes[isotope].ratio > mainIsotope[0]) {
      mainIsotope[0] = isotopes[isotope].ratio;
      mainIsotope[1] = isotope;
    }
  }
  let difference = 1 - ratioSum;
  if (Math.abs(difference) > 1e-7 && elements[element].abundance > 0) {
    throw new Error('Ratios add up to '.concat(1 - difference, ' for ', element));
  }
  elements[element].main = mainIsotope[1];
}

for (let resource in resources) {
  if (typeof resources[resource].decay !== 'undefined') {
    radioisotopes.push(resource);
  }
}

function isotopePrefix(isotope) {
  let prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return '<sup>' + prefix + '</sup>';
}

jsonfile.writeFileSync('build/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/elements.json', elements, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/radioisotopes.json', radioisotopes, {
  spaces: 2
});
