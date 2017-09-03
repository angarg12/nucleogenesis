/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

const args = process.argv.slice(2);

let upgrades = jsonfile.readFileSync(args[0]+'/data/upgrades.json');
let generators = jsonfile.readFileSync(args[0]+'/data/generators.json');
let upgradeComponent = fs.readFileSync(args[0]+'/scripts/component/matter.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player, production){
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

fs.writeFileSync(args[0]+'/scripts/component/matter.js', componentTemplate({'upgradeFunctions': concatFunctions}));

jsonfile.writeFileSync(args[0] + '/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/generators.json', generators, {
  spaces: 2
});
