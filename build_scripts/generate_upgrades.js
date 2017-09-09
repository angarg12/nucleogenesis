/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');

const args = process.argv.slice(2);

let upgrades = jsonfile.readFileSync(args[0]+'/data/upgrades.json');
let generators = jsonfile.readFileSync(args[0]+'/data/generators.json');

for(let key in upgrades){
  let upgrade = upgrades[key];
    if(!upgrade.prices){
      continue;
    }
  let nameTemplate = template(upgrade.name);
  let descriptionTemplate = template(upgrade.description);
  let tierTemplate = template(upgrade.tier);
  for(let generator in upgrade.prices){
    let generatorName = generators[generator].name;
    let generatedUpgrade = clone(upgrade);
    delete generatedUpgrade.prices;
    delete generatedUpgrade.tier;
    let price = upgrade.prices[generator];
    generatedUpgrade.price = price;
    generatedUpgrade.name = nameTemplate({'name': generatorName});
    generatedUpgrade.description = descriptionTemplate({'name': generatorName});
    generatedUpgrade.tiers = [tierTemplate({'id': generator})];
    for(let index in generatedUpgrade.function){
      generatedUpgrade.function[index] = template(generatedUpgrade.function[index])({'id': generator});
    }
    for(let index in generatedUpgrade.deps){
      generatedUpgrade.deps[index] = template(generatedUpgrade.deps[index])({'id': generator});
    }
    for(let index in generatedUpgrade.exotic_deps){
      generatedUpgrade.exotic_deps[index] = template(generatedUpgrade.exotic_deps[index])({'id': generator});
    }
    let id = key+'-'+generator;
    upgrades[id] = generatedUpgrade;
  }
  delete upgrades[key];
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

jsonfile.writeFileSync(args[0] + '/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/generators.json', generators, {
  spaces: 2
});
