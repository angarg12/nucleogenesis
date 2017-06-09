/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0] + '/data/resources.json');
let elements = jsonfile.readFileSync(args[0] + '/data/elements.json');
let radioisotopes = jsonfile.readFileSync(args[0] + '/data/radioisotopes.json');

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
    resources[isotope].ratio = isotopes[isotope].ratio;
    resources[isotope].decay = isotopes[isotope].decay;
    if (typeof isotopes[isotope].decay !== 'undefined') {
      radioisotopes[isotope] = isotopes[isotope];
    }
    resources[isotope].elements = {};
    resources[isotope].elements[element] = 1;
    resources[isotope].html = isotopePrefix(isotope) + element;
    resources[isotope].type = ['isotope'];

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
  if ((Math.abs(difference) > 1e-6) && !elements[element].disabled) {
    throw new Error('Ratios add up to '.concat(Math.round(ratioSum * 1000000) / 1000000, ' for ', element));
  }
  elements[element].main = mainIsotope[1];
}

function isotopePrefix(isotope) {
  let prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return '<sup>' + prefix + '</sup>';
}

jsonfile.writeFileSync(args[0] + '/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/elements.json', elements, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/radioisotopes.json', radioisotopes, {
  spaces: 2
});
