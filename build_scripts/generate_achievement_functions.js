/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

const args = process.argv.slice(2);

let achievements = jsonfile.readFileSync(args[0]+'/data/achievements.json');
let achievementService = fs.readFileSync(args[0]+'/scripts/component/achievements.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player){
  return <%= progress %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);

// convert conditions to progress, to normalise the implementation
for(let i in achievements){
let achievement = achievements[i];
  if(typeof achievement.condition === 'undefined') {
    continue;
  }
  if(achievement.condition.constructor === Array){
    achievement.condition = achievement.condition.join('\n');
  }
  achievement.progress = '('+achievement.condition+') ? 1 : 0';
  achievement.goals = [1];
  delete achievement.condition;
}

let functions = {};
for(let i in achievements){
  let achievement = achievements[i];
  let name = '_'+crypto.createHash('md5').update(achievement.progress).digest('hex');
  functions[name] = functionTemplate({ 'name': name, 'progress': achievement.progress });
  // we overwrite progress with the name
  achievements[i].progress = name;
}

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let serviceTemplate = template(achievementService);

fs.writeFileSync(args[0]+'/scripts/component/achievements.js', serviceTemplate({'functions': concatFunctions}));
jsonfile.writeFileSync(args[0] + '/data/achievements.json', achievements, {
  spaces: 2
});
