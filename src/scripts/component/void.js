/**
 void
 Component that handles dark matter and second prestige logic.
 It handles dark matter production and dark upgrades.
 A second prestige resets the progress of all elements with exotic
 matter and produces dark matter.

 @namespace Components
 */
'use strict';

angular.module('game').component('void', {
  templateUrl: 'views/void.html',
  controller: ['state', 'format', 'visibility', 'upgrade', 'data', 'util', _void],
  controllerAs: 'ct'
});

function _void(state, format, visibility, upgrade, data, util) {
  let ct = this;
  ct.state = state;
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
      // FIXME this is only necessary until all elements are implemented
      if(!state.player.elements[key]){
        continue;
      }
      let element = data.elements[key];
      state.player.resources[element.exotic].number = 0;
      let exoticUpgrades = state.player.elements[key].exotic_upgrades;
      for (let up in exoticUpgrades) {
        exoticUpgrades[up] = false;
      }
      upgrade.resetElement(state.player, key);
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

  ct.visibleDarkUpgrades = function(currentElement) {
    return visibility.visible(data.dark_upgrades, isDarkUpgradeVisible, currentElement);
  };

  function isDarkUpgradeVisible(name, currentElement) {
    return visibility.isUpgradeVisible(name, currentElement, data.dark_upgrades[name]);
  }
}
