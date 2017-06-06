/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0] + '/data/resources.json');
let elements = jsonfile.readFileSync(args[0] + '/data/elements.json');

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
  let mainIsotope = [0, ""];
  for (let isotope in isotopes) {
    resources[isotope] = {};
    resources[isotope].ratio = isotopes[isotope].ratio;
    resources[isotope].decay = isotopes[isotope].decay;
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
  if (ratioSum !== 1) {
    throw new Error("Ratios do not add up to 1 for ".concat(element));
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
