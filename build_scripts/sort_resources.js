/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const naturalSort = require('node-natural-sort');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0]+'/data/resources.json');
let elements = jsonfile.readFileSync(args[0]+'/data/elements.json');

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



let misc = ['e-','n','p','eV'];

for (let resource of misc) {
  sortedResources[resource] = resources[resource];
}

jsonfile.writeFileSync(args[0]+'/data/resources.json', sortedResources, {
  spaces: 2
});
