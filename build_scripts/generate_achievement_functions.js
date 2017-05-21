/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

const args = process.argv.slice(2);

let achievements = jsonfile.readFileSync(args[0]+'/data/achievements.json');
let achievementService = fs.readFileSync(args[0]+'/scripts/services/achievement.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player){
  return <%= condition %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);

let functions = {};
for(let i in achievements){
  let achievement = achievements[i];
  let name = '_'+crypto.createHash('md5').update(achievement.condition).digest('hex');
  functions[name] = functionTemplate({ 'name': name, 'condition': achievement.condition });
  // we overwrite the condition with the name
  achievements[i].condition = name;
}

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let serviceTemplate = template(achievementService);

fs.writeFileSync(args[0]+'/scripts/services/achievement.js', serviceTemplate({'functions': concatFunctions}));
jsonfile.writeFileSync(args[0] + '/data/achievements.json', achievements, {
  spaces: 2
});
