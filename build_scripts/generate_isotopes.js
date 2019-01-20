/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');
let radioisotopes = [];

let abundance = 0;
for (let element in elements) {
  abundance += elements[element].abundance;
  elements[element].includes = elements[element].includes || [];
  let exotic = 'x' + element;
  elements[element].exotic = exotic;

  resources[exotic] = {};
  resources[exotic].elements = {};
  resources[exotic].elements[element] = 1;
  resources[exotic].type = ['exotic'];
  resources[exotic].html = "&#5816"+element;

  let isotopes = elements[element].isotopes;
  let ratioSum = 0;
  let mainIsotope = [0, ''];
  for (let isotope in isotopes) {
    resources[isotope] = {};

    // https://en.wikipedia.org/wiki/Nuclear_binding_energy#Semiempirical_formula_for_nuclear_binding_energy
    let p = 938272081;
    let n = 939565413;
    let e = 511000;

    let Z = elements[element].number;
    let A = parseInt(isotope, 10);
    let N = A - Z;
    let calculatedEnergy = p*Z+n*N+e*Z;
    let calculatedBinding = 14-(13/Math.pow(A,1/3))-(0.585*Z*Z/Math.pow(A,4/3))-(19.3*Math.pow(N-Z,2)/Math.pow(A,2));
    if(Z%2 === 0 && N%2 === 0){
      calculatedBinding += 33/Math.pow(A,7/4)
    }
    if(Z%2 === 1 && N%2 === 1){
      calculatedBinding -= 33/Math.pow(A,7/4)
    }
    calculatedBinding *= A*1e6;
    calculatedBinding = Math.round(calculatedBinding);
    // the experimental formula fails for some small isotopes
    // so we just introduce the values by hand
    if(typeof isotopes[isotope].binding_energy !== 'undefined'){
      calculatedBinding = isotopes[isotope].binding_energy;
    }

    resources[isotope].energy = calculatedEnergy-calculatedBinding;
    resources[isotope].binding_energy = calculatedBinding;
    resources[isotope].elements = {};
    resources[isotope].elements[element] = 1;
    resources[isotope].html = isotopePrefix(isotope) + element;
    resources[isotope].decay = isotopes[isotope].decay;
    resources[isotope].type = ['isotope'];

    delete isotopes[isotope].decay;
    delete isotopes[isotope].binding_energy;

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
let difference = 1 - abundance;
if (Math.abs(difference) > 1e-7) {
  throw new Error('Abundance adds up to '.concat(1 - difference));
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
