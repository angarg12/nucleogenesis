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
function generateResource(isotope, charge, element){
  let name = generateName(isotope, charge);
  addResource(name, charge, isotope, element);
}

// Adds an isotope resource to the resources and elements list
function addResource(name, charge, isotope, element){
  if(!resources[name]){
    resources[name] = {};
    resources[name].elements = [element];
    resources[name].html = htmlPrefix(isotope) + element + htmlPostfix(charge);
    resources[name].charge = charge;
    resources[name].type = ['isotope','ion'];
  }

  if(elements[element].includes.indexOf(name) === -1){
    elements[element].includes.push(name);
  }
}

// Generates the name of a ion, e.g. 18O3+
function generateName(isotope, i) {
  if (i === 0) {
    return isotope;
  }
  let postfix = '';
  if(Math.abs(i) > 1){
    postfix = Math.abs(i);
  }
  postfix += getSign(i);
  return isotope + postfix;
}

function getSign(number){
  return number > 0 ? '+': '-';
}

// Generates the HTML prefix of an isotope (e.g. 18)
function htmlPrefix(isotope) {
  let prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return '<sup>' + prefix + '</sup>';
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
  if(element.disabled){
    continue;
  }
  let isotopes = elements[element].isotopes;
  for (let isotope in isotopes) {
    let energies = {};
    let charge = -1;
    for (let energy of elements[element].electron_affinity || []) {
      generateResource(isotope, charge, element);
      energies[charge] = -energy;
      charge--;
    }

    energies[0] = 0;

    charge = 1;
    for (let energy of elements[element].ionization_energy) {
      generateResource(isotope, charge, element);
      energies[charge] = energy;
      charge++;
    }

    if(typeof redox[element] === 'undefined'){
      redox[element] = energies;
    }
  }
}

// we delete 1H+ because it doesn't exist, it is a single proton
delete resources['1H+'];

jsonfile.writeFileSync(path.join(basePath, '/resources.json'), resources, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(basePath, '/elements.json'), elements, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(basePath, '/redox.json'), redox, {
  spaces: 2
});
