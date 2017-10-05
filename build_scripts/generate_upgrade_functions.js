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
let upgradeComponent = fs.readFileSync('build/scripts/component/generators.js').toString();
let upgradeService = fs.readFileSync('build/scripts/services/upgrade.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player, production, slot){
  return <%= func %>;
};`;

const FIRE_ONCE_FUNCTION_TEMPLATE = `this.<%= name %> = function (player){
  return <%= func %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);
let fireOnceFunctionTemplate = template(FIRE_ONCE_FUNCTION_TEMPLATE);

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
    //console.log(i+" "+functionType+ " "+upgrade[functionType])
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
let fireOncefunctions = {};

generateFunctions(upgrades, 'function', functions, functionTemplate);
generateFunctions(upgrades, 'fire_once_function', fireOncefunctions, fireOnceFunctionTemplate);
generateFunctions(exoticUpgrades, 'function', functions, functionTemplate);
generateFunctions(exoticUpgrades, 'fire_once_function', fireOncefunctions, fireOnceFunctionTemplate);
generateFunctions(darkUpgrades, 'function', functions, functionTemplate);
generateFunctions(darkUpgrades, 'fire_once_function', fireOncefunctions, fireOnceFunctionTemplate);

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let sourceTemplate = template(upgradeComponent);

fs.writeFileSync('build/scripts/component/generators.js', sourceTemplate({'upgradeFunctions': concatFunctions}));

concatFunctions = '';
for(let i in fireOncefunctions){
  concatFunctions += fireOncefunctions[i]+'\n';
}

sourceTemplate = template(upgradeService);

fs.writeFileSync('build/scripts/services/upgrade.js', sourceTemplate({'fireOnceFunctions': concatFunctions}));

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
