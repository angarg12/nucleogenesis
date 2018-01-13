/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');

let upgrades = jsonfile.readFileSync('build/data/upgrades.json');
let exoticUpgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let darkUpgrades = jsonfile.readFileSync('build/data/dark_upgrades.json');
let generators = jsonfile.readFileSync('build/data/generators.json');

for(let key in upgrades){
  let upgrade = upgrades[key];
    if(!upgrade.prices){
      continue;
    }
  let nameTemplate = template(upgrade.name);
  let descriptionTemplate = template(upgrade.description);
  let tierTemplate = template(upgrade.tier);
  for(let generator in upgrade.prices){
    let prices = upgrade.prices[generator];
    if(prices.constructor !== Array){
      prices = [prices];
    }
    for(let i in prices){
      let price = prices[i];
      let generatorName = generators[generator].name;
      let generatedUpgrade = clone(upgrade);
      delete generatedUpgrade.prices;
      delete generatedUpgrade.tier;
      generatedUpgrade.price = price;
      generatedUpgrade.name = nameTemplate({'name': generatorName});
      generatedUpgrade.description = descriptionTemplate({'name': generatorName});
      generatedUpgrade.tiers = [tierTemplate({'id': generator})];
      generatedUpgrade.tags.push(tierTemplate({'id': generator}));
      for(let index in generatedUpgrade.function){
        generatedUpgrade.function[index] = template(generatedUpgrade.function[index])({'id': generator});
      }
      for(let index in generatedUpgrade.deps){
        generatedUpgrade.deps[index] = template(generatedUpgrade.deps[index])({'id': generator});
      }
      for(let index in generatedUpgrade.exotic_deps){
        generatedUpgrade.exotic_deps[index] = template(generatedUpgrade.exotic_deps[index])({'id': generator});
      }
      let id = key+'-'+generator+'-'+i;
      upgrades[id] = generatedUpgrade;
      if(i > 0){
        upgrades[id].deps.push(key+'-'+generator+'-'+(i-1));
       }
    }
  }
  delete upgrades[key];
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

for(let key in upgrades){
  let upgrade = upgrades[key];
  for(let up of upgrade.deps){
    if(!upgrades[up]){
      throw new Error('Dependency doesn\'t exist: '+ up + ' for '+ key);
    }
  }
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

jsonfile.writeFileSync('build/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/generators.json', generators, {
  spaces: 2
});
