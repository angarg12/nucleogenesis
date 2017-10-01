/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

let upgrades = jsonfile.readFileSync('build/data/upgrades.json');
let generators = jsonfile.readFileSync('build/data/generators.json');
let upgradeComponent = fs.readFileSync('build/scripts/component/generators.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player, production, slot){
  return <%= func %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);
let functions = {};

for(let key in upgrades){
  let upgrade = upgrades[key];
  for(let generator of upgrade.tiers){
    if(!generators[generator].upgrades){
      generators[generator].upgrades = [];
    }
    generators[generator].upgrades.push(key);
  }
}

for(let i in upgrades){
  let upgrade = upgrades[i];
  if(upgrade.function.constructor === Array){
    upgrade.function = upgrade.function.join('\n');
  }

  let name = '_'+crypto.createHash('md5').update(upgrade.function).digest('hex');
  functions[name] = functionTemplate({ 'name': name, 'func': upgrade.function });
  // we overwrite progress with the name
  upgrade.function = name;
}

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let componentTemplate = template(upgradeComponent);

fs.writeFileSync('build/scripts/component/generators.js', componentTemplate({'upgradeFunctions': concatFunctions}));

jsonfile.writeFileSync('build/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/generators.json', generators, {
  spaces: 2
});
