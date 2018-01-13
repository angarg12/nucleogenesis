/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

// Generates an ion resource
function generateResource(element, charge){
  let name = generateName(element, charge);
  addResource(name, charge, element);
}

// Adds an ion resource to the resources and elements list
function addResource(name, charge, element){
  if(!resources[name]){
    resources[name] = {};
    resources[name].elements = {};
    resources[name].elements[element] = 1;
    let isotopeEnergy = resources[elements[element].main].energy;
    resources[name].energy = isotopeEnergy - resources['e-'].energy * charge;
    resources[name].html = element + htmlPostfix(charge);
    resources[name].charge = charge;
    resources[name].type = ['ion'];
  }

  if(elements[element].includes.indexOf(name) === -1){
    elements[element].includes.push(name);
  }
  if(charge < 0 && elements[element].anions.indexOf(name) === -1){
    elements[element].anions.push(name);
  }
  if(charge > 0 && elements[element].cations.indexOf(name) === -1){
    elements[element].cations.push(name);
  }
}

// Generates the name of a ion, e.g. O3+
function generateName(element, i) {
  if (i === 0) {
    return element;
  }
  let postfix = '';
  if(Math.abs(i) > 1){
    postfix = Math.abs(i);
  }
  postfix += getSign(i);
  return element + postfix;
}

function getSign(number){
  return number > 0 ? '+': '-';
}

// Generates the HTML postfix of an ion (+ or -)
function htmlPostfix(index) {
  let postfix = '';
  if(index === 0){
    return postfix;
  }
  postfix = Math.abs(index).toString();
  postfix = postfix === '1' ? '' : postfix;
  return '<sup>' + postfix + getSign(index) + '</sup>';
}

let minElectronegativity = Number.MAX_VALUE;
let maxElectronegativity = -Number.MAX_VALUE;
let redox = {};
for (let element in elements) {
  elements[element].includes = elements[element].includes || [];
  elements[element].anions = elements[element].anions || [];
  elements[element].cations = elements[element].cations || [];

  if(elements[element].electronegativity > 0 && elements[element].electronegativity < minElectronegativity){
    minElectronegativity = elements[element].electronegativity;
  }
  if(elements[element].electronegativity > maxElectronegativity){
    maxElectronegativity = elements[element].electronegativity;
  }

  let energies = {};
  let charge = -1;
  for (let energy of elements[element].electron_affinity || []) {
    generateResource(element, charge);
    energies[charge] = -energy;
    charge--;
  }

  energies[0] = 0;

  charge = 1;
  for (let energy of elements[element].ionization_energy || []) {
    generateResource(element, charge);
    energies[charge] = energy;
    charge++;
  }

  let cummulative = {};
  for(let charge in energies){
    cummulative[charge] =  cumulativeEnergy(energies, charge);
  }
  if(typeof redox[element] === 'undefined'){
    redox[element] = cummulative;
  }
}

/* Calculates the cummulative energy of a redox level.
The logic is the following: the redox array gives how much energy it costs
to go from a level to the next, e.g. from +2 to +3. This function calculates
how much it takes to go from level 0 to x by summing each successive level */
function cumulativeEnergy(redox, level) {
  let energy = 0;
  let start = Math.min(0, level);
  let end = Math.max(0, level);
  for (let i = start; i <= end; i++) {
    energy += redox[i];
  }
  if (level < 0) {
    energy = -energy;
  }
  return energy;
}

for (let element in elements) {
  let power = elements[element].electronegativity-minElectronegativity;
  elements[element].negative_factor = Math.pow(10, power);
  power = maxElectronegativity-elements[element].electronegativity;
  elements[element].positive_factor = Math.pow(10, power);
}

jsonfile.writeFileSync('build/data/resources.json', resources, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/elements.json', elements, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/redox.json', redox, {
  spaces: 2
});
