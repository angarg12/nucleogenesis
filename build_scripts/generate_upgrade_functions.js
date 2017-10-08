/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

let upgrades = jsonfile.readFileSync('build/data/upgrades.json');
let exoticUpgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let darkUpgrades = jsonfile.readFileSync('build/data/dark_upgrades.json');
let generators = jsonfile.readFileSync('build/data/generators.json');
let upgradeService = fs.readFileSync('build/scripts/services/upgrade.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (args){
  return <%= func %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);


// add upgrades to generators
for(let key in upgrades){
  let upgrade = upgrades[key];
  for(let generator of upgrade.tiers){
    if(!generators[generator].upgrades){
      generators[generator].upgrades = [];
    }
    generators[generator].upgrades.push(key);
  }
}

function generateFunctions(upgradesData, functionType, result, upgradeTemplate) {
  for(let i in upgradesData){
    let upgrade = upgradesData[i];

    if(!upgrade[functionType]){
      continue;
    }
    if(upgrade[functionType].constructor === Array){
      upgrade[functionType] = upgrade[functionType].join('\n');
    }

    let name = '_'+crypto.createHash('md5').update(upgrade[functionType]).digest('hex');
    result[name] = upgradeTemplate({ 'name': name, 'func': upgrade[functionType] });
    // we overwrite progress with the name
    upgrade[functionType] = name;
  }
}

let functions = {};

generateFunctions(upgrades, 'function', functions, functionTemplate);
generateFunctions(exoticUpgrades, 'function', functions, functionTemplate);
generateFunctions(darkUpgrades, 'function', functions, functionTemplate);

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let sourceTemplate = template(upgradeService);

fs.writeFileSync('build/scripts/services/upgrade.js', sourceTemplate({'upgradeFunctions': concatFunctions}));

jsonfile.writeFileSync('build/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/exotic_upgrades.json', exoticUpgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/dark_upgrades.json', darkUpgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/generators.json', generators, {
  spaces: 2
});
