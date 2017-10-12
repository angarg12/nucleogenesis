/* eslint-env node */
/*jslint node: true */
'use strict';

let jsonfile = require('jsonfile');

let resources = jsonfile.readFileSync('build/data/resources.json');
let elements = jsonfile.readFileSync('build/data/elements.json');
let generators = jsonfile.readFileSync('build/data/generators.json');
let globalUpgrades = jsonfile.readFileSync('build/data/global_upgrades.json');
let exoticUpgrades = jsonfile.readFileSync('build/data/exotic_upgrades.json');
let darkUpgrades = jsonfile.readFileSync('build/data/dark_upgrades.json');
let achievements = jsonfile.readFileSync('build/data/achievements.json');
let unlocks = jsonfile.readFileSync('build/data/unlocks.json');
let element_slot = jsonfile.readFileSync('build/data/element_slot.json');
let mechanics = jsonfile.readFileSync('build/data/mechanics.json');

let startPlayer = {
  elements_unlocked: 1
};

// read the version from the npm config
let npm = jsonfile.readFileSync('package.json');

startPlayer.version = npm.version;

/**
     * Default numberformat to be used with swarm-numberformat.
     *
     * Formats are:
     *    - standard
     *    - scientific
     *    - hybrid
     *    - engineering
     * Flavors are:
     *    - full
     *    - short
     */
startPlayer.numberformat = {format: 'standard', flavor: 'short'};
startPlayer.resources = {};
for (let entry in resources) {
  startPlayer.resources[entry] = {
    number: 0,
    unlocked: false
  };
}

startPlayer.elements = {};
for (let element in elements) {
  if (!elements[element].abundance > 0) {
    startPlayer.elements[element] = false;
  }
}

startPlayer.global_upgrades = {};
for (let upgrade in globalUpgrades) {
  startPlayer.global_upgrades[upgrade] = 0;
}

startPlayer.exotic_upgrades = {H:{}};
for (let upgrade in exoticUpgrades) {
  startPlayer.exotic_upgrades.H[upgrade] = false;
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

element_slot.element = 'H';
startPlayer.element_slots = [element_slot];

// cooldowns for exotic prestige. Maps to indexes in the element_slots
startPlayer.cooldowns = {
  0: 0
}

startPlayer.mechanics = {};
for(let mechanic in mechanics){
  startPlayer.mechanics[mechanic] = false;
}

startPlayer.mechanic_slots = 1;

startPlayer.elements.H = true;

let mainHydrogen = elements.H.main;
startPlayer.resources[mainHydrogen].unlocked = true;

let first = Object.keys(generators)[0];
startPlayer.resources[mainHydrogen].number = generators[first].price;

jsonfile.writeFileSync('build/data/start_player.json', startPlayer, {
  spaces: 2
});
