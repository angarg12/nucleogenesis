/**
 dark
 Component that handles dark matter and second prestige logic.
 It handles dark matter production and dark upgrades.
 A second prestige resets the progress of all elements with exotic
 matter and produces dark matter.

 @namespace Components
 */
'use strict';

angular.module('game').component('dark', {
  templateUrl: 'views/dark.html',
  controller: ['state', 'format', 'visibility', 'upgrade', 'data', 'util', dark],
  controllerAs: 'ct'
});

function dark(state, format, visibility, upgrade, data, util) {
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
      state.player.exotic_upgrades[key] = angular.copy(data.exotic_upgrades);
    }
    for(let slot of state.player.element_slots){
      upgrade.resetElement(state.player, slot.element);
    }
    // FIXME: copy the hydrogen for the time being. actually should be set to null
    for(let index in state.player.element_slots){
      state.player.element_slots[index] = angular.copy(data.element_slot);
      state.player.element_slots[index].generators['1'] = 1;
      state.player.element_slots[index].element = 'H';
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

  ct.visibleDarkUpgrades = function() {
    return visibility.visible(data.dark_upgrades, isDarkUpgradeVisible, 0);
  };

  // here we receive not the name of the element, but the index in the element_slots
  function isDarkUpgradeVisible(name, index) {
    return visibility.isUpgradeVisible(name, index, data.dark_upgrades[name]);
  }
}
