/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const naturalSort = require('node-natural-sort');

let args = process.argv.slice(2);

let resources = jsonfile.readFileSync(args[0]+'/data/resources.json');
let elements = jsonfile.readFileSync(args[0]+'/data/elements.json');

let sorted_resources = {};

for (let element in elements) {
  let includes = elements[element].includes.sort(naturalSort());
  for (let resource of includes) {
    sorted_resources[resource] = resources[resource];
  }
}

let misc = ['e-','n','p','eV'];

for (let resource of misc) {
  sorted_resources[resource] = resources[resource];
}

jsonfile.writeFileSync(args[0]+'/data/resources.json', sorted_resources, {
  spaces: 2
});
