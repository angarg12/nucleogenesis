'use strict';

angular.module('game').component('void', {
  templateUrl: 'views/void.html',
  controller: ['state', 'format', 'visibility', 'data', 'util', _void],
  controllerAs: 'ct'
});

function _void(state, format, visibility, data, util) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;
  ct.util = util;
  ct.format = format;

  ct.darkProduction = function() {
    let production = 0;
    for (let element in data.elements) {
      let exotic = data.elements[element].exotic;
      if (!state.player.resources[exotic].unlocked) {
        continue;
      }
      production += Math.floor(Math.max(0, Math.log(state.player.resources[exotic].number)));
    }

    return production;
  };

  ct.darkPrestige = function() {
    let resources = state.player.resources;
    let production = ct.darkProduction();

    resources.dark_matter.number += production;
    resources.dark_matter.unlocked = true;

    for(let key in data.elements){
      let element = data.elements[key];
      if (!state.player.resources[element.exotic].unlocked) {
        continue;
      }
      state.player.resources[element.exotic].number = 0;

      for (let resource of element.includes) {
        resources[resource].number = 0;
      }

      let upgrades = state.player.elements[key].upgrades;
      for (let upgrade in upgrades) {
        upgrades[upgrade] = false;
      }

      let exoticUpgrades = state.player.elements[key].exotic_upgrades;
      for (let upgrade in exoticUpgrades) {
        exoticUpgrades[upgrade] = false;
      }

      let generators = state.player.elements[key].generators;
      for (let generator in generators) {
        generators[generator] = 0;
      }

      let syntheses = element.syntheses;
      for (let synthesis of syntheses) {
        state.player.syntheses[synthesis].active = 0;
      }
      delete generators['0'];
      let first = Object.keys(generators)[0];

      state.player.elements[key].generators[first] = 1;
    }
  };

  ct.buyDarkUpgrade = function(name) {
    if (state.player.dark_upgrades[name]) {
      return;
    }
    let price = data.dark_upgrades[name].price;
    let currency = 'dark_matter';

    if (state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.dark_upgrades[name] = true;
    }
  };
}
