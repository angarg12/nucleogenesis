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
startPlayer.options = {};
startPlayer.options.numberformat = {format: 'scientific', flavor: 'short', maxSmall: '1', sigfigs: 4};
startPlayer.options.buyIndex = 0;
startPlayer.options.adjustIndex = 0;
startPlayer.options.elementBuyIndex = 0;
startPlayer.options.hideBought = false;
startPlayer.options.sortIndex = 0;
startPlayer.options.hideAchievements = false;
startPlayer.options.autoBuyGenerators = false;
startPlayer.all_reaction_active = false;
startPlayer.all_redox_active = false;
startPlayer.offline = 0;
startPlayer.resources = {};
for (let entry in resources) {
  startPlayer.resources[entry] = null;
}

startPlayer.elements = {};
for (let element in elements) {
  startPlayer.elements[element] = false;
}

startPlayer.global_upgrades = {};
startPlayer.global_upgrades_current = {};
for (let upgrade in globalUpgrades) {
  startPlayer.global_upgrades[upgrade] = 1;
  if(globalUpgrades[upgrade].adjustable){
    startPlayer.global_upgrades_current[upgrade] = 1;
  }
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

startPlayer.fusion = [{
  active: false,
  running: false,
  beam: {
    name: '1H',
    number: 0
  },
  target: {
    name: '1H',
    number: 0
  },
  eV: 0
}];

startPlayer.statistics = {};
startPlayer.statistics.exotic_run = {H:{}};
startPlayer.statistics.dark_run = {};
startPlayer.statistics.all_time = {};

startPlayer.elements.H = true;

let mainHydrogen = elements.H.main;
let first = Object.keys(generators)[0];
startPlayer.resources[mainHydrogen] = generators[first].price;
startPlayer.statistics.exotic_run.H['1H'] = 0;

jsonfile.writeFileSync('build/data/start_player.json', startPlayer, {
  spaces: 2
});
