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
let upgradeComponent = fs.readFileSync(args[0]+'/scripts/component/nova.js').toString();

for(let key in upgrades){
  let upgrade = upgrades[key];
  for(let generator of upgrade.tiers){
    if(!generators[generator].upgrades){
      generators[generator].upgrades = [];
    }
    generators[generator].upgrades.push(key);
  }
}

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player){
  return <%= progress %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);

let functions = {};

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let componentTemplate = template(upgradeComponent);

//fs.writeFileSync(args[0]+'/scripts/component/nova.js', componentTemplate({'functions': concatFunctions}));

jsonfile.writeFileSync(args[0] + '/data/upgrades.json', upgrades, {
  spaces: 2
});
jsonfile.writeFileSync(args[0] + '/data/generators.json', generators, {
  spaces: 2
});
