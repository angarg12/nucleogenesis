/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let path = require('path');

let args = process.argv.slice(2);

let basePath = path.join(args[0], '/data');

let resources = jsonfile.readFileSync(path.join(basePath, '/resources.json'));
let elements = jsonfile.readFileSync(path.join(basePath, '/elements.json'));

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
    resources[name].html = element + htmlPostfix(charge);
    resources[name].charge = charge;
    resources[name].type = ['ion'];
  }

  if(elements[element].includes.indexOf(name) === -1){
    elements[element].includes.push(name);
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

let redox = {};
for (let element in elements) {
  elements[element].includes = elements[element].includes || [];
// FIXME: keep this only until all elements all included
  if(elements[element].disabled){
    continue;
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
  for (let energy of elements[element].ionization_energy) {
    generateResource(element, charge);
    energies[charge] = energy;
    charge++;
  }

  if(typeof redox[element] === 'undefined'){
    redox[element] = energies;
  }
}

// we delete 1H+ because it doesn't exist, it is a single proton
delete resources['H+'];
let index = elements.H.includes.indexOf('H+');
if (index > -1) {
    elements.H.includes.splice(index, 1);
}

jsonfile.writeFileSync(path.join(basePath, '/resources.json'), resources, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(basePath, '/elements.json'), elements, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(basePath, '/redox.json'), redox, {
  spaces: 2
});
