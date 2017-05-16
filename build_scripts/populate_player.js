/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let path = require('path');

let args = process.argv.slice(2);

let basePath = path.join(args[0],'/data');

let resources = jsonfile.readFileSync(path.join(basePath,'/resources.json'));
let elements = jsonfile.readFileSync(path.join(basePath,'/elements.json'));
let generators = jsonfile.readFileSync(path.join(basePath,'/generators.json'));
let upgrades = jsonfile.readFileSync(path.join(basePath,'/upgrades.json'));
let achievements = jsonfile.readFileSync(path.join(basePath,'/achievements.json'));
let syntheses = jsonfile.readFileSync(path.join(basePath,'/syntheses.json'));

let startPlayer = {
  elements_unlocked : 1
};

// read the version from the npm config
let npm = jsonfile.readFileSync('package.json');

startPlayer.version = npm.version;
startPlayer.resources = {};
for(let entry in resources) {
  startPlayer.resources[entry] = {
    number : 0,
    unlocked : false
  };
}

startPlayer.elements = {};
for(let element in elements) {
  if(!elements[element].disabled) {
    startPlayer.elements[element] = {
      unlocked : false
    };
  }
}

for(let element in startPlayer.elements) {
  startPlayer.elements[element].upgrades = {};
  for(let upgrade in upgrades) {
    startPlayer.elements[element].upgrades[upgrade] = false;
  }
  startPlayer.elements[element].generators = {};
  for(let generator in generators) {
    startPlayer.elements[element].generators[generator] = 0;
  }
}
// start_player.encyclopedia = {};
// for(let entry in encyclopedia) {
//   start_player.encyclopedia[entry] = {
//     is_new : true
//   };
// }
startPlayer.achievements = {};
for(let entry in achievements) {
  startPlayer.achievements[entry] = false;
}
startPlayer.syntheses = {};
for(let entry in syntheses) {
  startPlayer.syntheses[entry] = {
    number : 0,
    active : 0
  };
}

startPlayer.elements.H.unlocked = true;

let mainHydrogen = elements.H.main;
startPlayer.resources[mainHydrogen].unlocked = true;

let first = Object.keys(generators)[0];
startPlayer.resources[mainHydrogen].number = generators[first].price;

process.stdout.write(JSON.stringify(startPlayer, null, 2));
