/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const naturalSort = require('node-natural-sort');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');

let sortedResources = {};

// first, pick only non molecules
for (let element in elements) {
  let includes = elements[element].includes.sort(naturalSort());
  for (let resource of includes) {
    if(resources[resource].type.indexOf('molecule') === -1){
      sortedResources[resource] = resources[resource];
    }
  }

  let exotic = elements[element].exotic;
  sortedResources[exotic] = resources[exotic];
}

// second, pick only molecules
for (let element in elements) {
  let includes = elements[element].includes.sort(naturalSort());
  for (let resource of includes) {
    if(resources[resource].type.indexOf('molecule') !== -1){
      sortedResources[resource] = resources[resource];
    }
  }
}

let misc = [];

for (let resource in resources) {
  if(typeof sortedResources[resource] === 'undefined'){
    misc.push(resource);
  }
}

for (let resource of misc) {
  sortedResources[resource] = resources[resource];
}

jsonfile.writeFileSync('build/data/resources.json', sortedResources, {
  spaces: 2
});
