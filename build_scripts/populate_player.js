/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');
let path = require('path');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');
let generators = jsonfile.readFileSync('build/data/generators.json');
let upgrades = jsonfile.readFileSync('build/data/upgrades.json');
let globalUpgrades = jsonfile.readFileSync('build/data/global_upgrades.json');
let exoticUpgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let darkUpgrades = jsonfile.readFileSync('build/data/dark_upgrades.json');
let achievements = jsonfile.readFileSync('build/data/achievements.json');
let unlocks = jsonfile.readFileSync('build/data/unlocks.json');
let reactions = jsonfile.readFileSync('build/data/reactions.json');

let startPlayer = {
  elements_unlocked: 1
};

// read the version from the npm config
let npm = jsonfile.readFileSync('package.json');

startPlayer.version = npm.version;
startPlayer.resources = {};
for (let entry in resources) {
  startPlayer.resources[entry] = {
    number: 0,
    unlocked: false
  };
}

startPlayer.elements = {};
for (let element in elements) {
  if (!elements[element].disabled) {
    startPlayer.elements[element] = {
      unlocked: false
    };
  }
}

for (let element in startPlayer.elements) {
  startPlayer.elements[element].upgrades = {};
  for (let upgrade in upgrades) {
    startPlayer.elements[element].upgrades[upgrade] = false;
  }
  startPlayer.elements[element].exotic_upgrades = {};
  for (let upgrade in exoticUpgrades) {
    startPlayer.elements[element].exotic_upgrades[upgrade] = false;
  }
  startPlayer.elements[element].generators = {};
  for (let generator in generators) {
    startPlayer.elements[element].generators[generator] = 0;
  }
}

startPlayer.global_upgrades = {};
for (let upgrade in globalUpgrades) {
  startPlayer.global_upgrades[upgrade] = 0;
}

startPlayer.dark_upgrades = {};
for (let upgrade in darkUpgrades) {
  startPlayer.dark_upgrades[upgrade] = false;
}

startPlayer.achievements = {};
for (let entry in achievements) {
  startPlayer.achievements[entry] = 0;
}

startPlayer.unlocks = {};
for (let entry in unlocks) {
  startPlayer.unlocks[entry] = 0;
}

startPlayer.redox = [];
startPlayer.reactions = [];

startPlayer.elements.H.unlocked = true;

let mainHydrogen = elements.H.main;
startPlayer.resources[mainHydrogen].unlocked = true;

let first = Object.keys(generators)[0];
startPlayer.resources[mainHydrogen].number = generators[first].price;

jsonfile.writeFileSync('build/data/start_player.json', startPlayer, {
  spaces: 2
});
