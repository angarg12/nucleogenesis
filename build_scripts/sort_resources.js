/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const naturalSort = require('node-natural-sort');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0]+'/data/resources.json');
let elements = jsonfile.readFileSync(args[0]+'/data/elements.json');

let sortedResources = {};

for (let element in elements) {
  let includes = elements[element].includes.sort(naturalSort());
  for (let resource of includes) {
    sortedResources[resource] = resources[resource];
  }
  let exotic = elements[element].exotic;
  sortedResources[exotic] = resources[exotic];
}

let misc = ['e-','n','p','eV'];

// FIXME: only until we fix ions!!

misc.push('1H-','3He+');

for (let resource of misc) {
  sortedResources[resource] = resources[resource];
}

jsonfile.writeFileSync(args[0]+'/data/resources.json', sortedResources, {
  spaces: 2
});
