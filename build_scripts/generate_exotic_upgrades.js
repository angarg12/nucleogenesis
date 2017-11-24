/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');

let exoticUpgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let darkUpgrades = jsonfile.readFileSync('build/data/dark_upgrades.json');
let generators = jsonfile.readFileSync('build/data/generators.json');

for(let key in exoticUpgrades){
  let upgrade = exoticUpgrades[key];
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
    exoticUpgrades[id] = generatedUpgrade;
  }
  delete exoticUpgrades[key];
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

for(let key in exoticUpgrades){
  let upgrade = exoticUpgrades[key];
  for(let up of upgrade.exotic_deps){
    if(!exoticUpgrades[up]){
      throw new Error('Exotic dependency doesn\'t exist: '+ up + ' for '+ key);
    }
  }
  for(let up of upgrade.dark_deps){
    if(!darkUpgrades[up]){
      throw new Error('Dark dependency doesn\'t exist: '+ up + ' for '+ key);
    }
  }
}

jsonfile.writeFileSync('build/data/exotic_upgrades.json', exoticUpgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/generators.json', generators, {
  spaces: 2
});
