'use strict';

var jsonfile = require('jsonfile');
var path = require('path');

var args = process.argv.slice(2);

var base_path = path.join(args[0],'/data');

var resources = jsonfile.readFileSync(path.join(base_path,'/resources.json'));
var elements = jsonfile.readFileSync(path.join(base_path,'/elements.json'));
var generators = jsonfile.readFileSync(path.join(base_path,'/generators.json'));
var upgrades = jsonfile.readFileSync(path.join(base_path,'/upgrades.json'));
var encyclopedia = jsonfile.readFileSync(path.join(base_path,'/encyclopedia.json'));
var achievements = jsonfile.readFileSync(path.join(base_path,'/achievements.json'));
var syntheses = jsonfile.readFileSync(path.join(base_path,'/syntheses.json'));

var start_player = {
  elements_unlocked : 1
};

// read the version from the npm config
var npm = jsonfile.readFileSync('package.json');

start_player.version = npm.version;
start_player.resources = {};
for(var entry in resources) {
  start_player.resources[entry] = {
    number : 0,
    unlocked : false
  };
}

start_player.elements = {};
for(var element in elements) {
  if(!elements[element].disabled) {
    start_player.elements[element] = {
      unlocked : false
    };
  }
}

for(var element in start_player.elements) {
  start_player.elements[element].upgrades = {};
  for(var upgrade in upgrades) {
    start_player.elements[element].upgrades[upgrade] = false;
  }
  start_player.elements[element].generators = {};
  for(var generator in generators) {
    start_player.elements[element].generators[generator] = 0;
  }
}
// start_player.encyclopedia = {};
// for(var entry in encyclopedia) {
//   start_player.encyclopedia[entry] = {
//     is_new : true
//   };
// }
start_player.achievements = {};
for(var entry in achievements) {
  start_player.achievements[entry] = false;
}
start_player.syntheses = {};
for(var entry in syntheses) {
  start_player.syntheses[entry] = {
    number : 0,
    active : 0
  };
}

start_player.elements.H.unlocked = true;

var main_hydrogen = elements.H.main;
start_player.resources[main_hydrogen].unlocked = true;

var first = Object.keys(generators)[0];
start_player.resources[main_hydrogen].number = generators[first].price;

process.stdout.write(JSON.stringify(start_player, null, 2));
