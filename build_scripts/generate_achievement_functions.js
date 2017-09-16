/* eslint-env node */
/*jslint node: true */
'use strict';

const jsonfile = require('jsonfile');
const template = require('lodash.template');
const crypto = require('crypto');
const fs = require('fs');

let achievements = jsonfile.readFileSync('build/data/achievements.json');
let unlocks = jsonfile.readFileSync('build/data/unlocks.json');
let achievementService = fs.readFileSync('build/scripts/component/achievements.js').toString();

const FUNCTION_TEMPLATE = `this.<%= name %> = function (player){
  return <%= progress %>;
};`;

let functionTemplate = template(FUNCTION_TEMPLATE);

// convert conditions to progress, to normalise the implementation
function conditionToProgress(source){
  for(let i in source){
  let achievement = source[i];
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
}
function createFunctions(source){
  for(let i in source){
    let achievement = source[i];
    if(achievement.progress.constructor === Array){
      achievement.progress = achievement.progress.join('\n');
    }
    let name = '_'+crypto.createHash('md5').update(achievement.progress).digest('hex');
    functions[name] = functionTemplate({ 'name': name, 'progress': achievement.progress });
    // we overwrite progress with the name
    source[i].progress = name;
  }
}

let functions = {};
conditionToProgress(achievements);
conditionToProgress(unlocks);
createFunctions(achievements);
createFunctions(unlocks);

let concatFunctions = '';
for(let i in functions){
  concatFunctions += functions[i]+'\n';
}

let serviceTemplate = template(achievementService);

fs.writeFileSync('build/scripts/component/achievements.js', serviceTemplate({'functions': concatFunctions}));

jsonfile.writeFileSync('build/data/achievements.json', achievements, {
  spaces: 2
});
jsonfile.writeFileSync('build/data/unlocks.json', unlocks, {
  spaces: 2
});
