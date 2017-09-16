/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');

let upgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let generators = jsonfile.readFileSync('build/data/generators.json');

for(let key in upgrades){
  let upgrade = upgrades[key];
    if(!upgrade.prices){
      continue;
    }
  let nameTemplate = template(upgrade.name);
  let descriptionTemplate = template(upgrade.description);
  for(let i in upgrade.prices){
    let generatedUpgrade = clone(upgrade);
    delete generatedUpgrade.prices;
    let price = upgrade.prices[i];
    generatedUpgrade.price = price;
    generatedUpgrade.name = nameTemplate({'id': i});
    generatedUpgrade.description = descriptionTemplate({'id': i});
    for(let index in generatedUpgrade.function){
      generatedUpgrade.function[index] = template(generatedUpgrade.function[index])({'id': i});
    }
    for(let index in generatedUpgrade.exotic_deps){
      generatedUpgrade.exotic_deps[index] = template(generatedUpgrade.exotic_deps[index])({'id': i});
    }
    let id = key+'-'+i;
    upgrades[id] = generatedUpgrade;
  }
  delete upgrades[key];
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

jsonfile.writeFileSync('build/data/exotic_upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/generators.json', generators, {
  spaces: 2
});
