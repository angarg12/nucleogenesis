'use strict';

angular.module('game').component('void', {
  templateUrl: 'views/void.html',
  controller: ['state', 'format', 'visibility', 'upgrade', 'data', 'util', _void],
  controllerAs: 'ct'
});

function _void(state, format, visibility, upgrade, data, util) {
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

    for(let element in data.elements){
      upgrade.resetElement(state.player, element);
    }
  };

  ct.buyDarkUpgrade = function(name) {
    let upgrades = state.player.dark_upgrades;
    let price = data.dark_upgrades[name].price;
    let currency = 'dark_matter';
    upgrade.buyUpgrade(state.player,
      upgrades,
      name,
      price,
      currency);
  };
}
