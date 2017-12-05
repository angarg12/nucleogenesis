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
  ct.cache = {breakdown:{}};

  ct.update = function(player) {
    refresh(player);
  };

  /* Refreshes the values in the cache */
  function refresh(player){
      ct.cache.breakdown = {};
      for (let element in data.elements) {
        let exotic = data.elements[element].exotic;
        if (!player.resources[exotic].unlocked || !player.statistics.dark_run[exotic]) {
          continue;
        }
        let number = player.statistics.dark_run[exotic];
        let darkProduction = Math.pow(Math.E,(-0.5+Math.sqrt(0.25+0.8686*Math.log(number/100)))/1.4427) || 0;
        ct.cache.breakdown[exotic] = Math.round(Math.max(0, darkProduction));
      }
  }

  ct.darkProduction = function() {
    let production = 0;
    for (let resource in ct.cache.breakdown) {
      production += ct.cache.breakdown[resource];
    }

    return production;
  };

  ct.darkPrestige = function() {
    let production = ct.darkProduction();

    util.addResource(state.player, 'all_time', 'dark_matter', production);

    for(let key in data.elements){
      let element = data.elements[key];
      state.player.resources[element.exotic].number = 0;
      if(!state.player.exotic_upgrades[key]){
        continue;
      }
      for(let up in data.exotic_upgrades){
        state.player.exotic_upgrades[key][up] = false;
      }
    }
    for(let slot of state.player.element_slots){
      if(!slot){
        continue;
      }
      upgrade.resetElement(state.player, slot.element);
    }

    for(let i in state.player.element_slots){
      state.player.element_slots[i] = null;
    }
    state.player.statistics.exotic_run = {};
    state.player.statistics.dark_run = {};
  };

  ct.buyDarkUpgrade = function(name) {
    let upgrades = state.player.dark_upgrades;
    let price = data.dark_upgrades[name].price;
    let currency = 'dark_matter';
    upgrade.buyUpgrade(state.player,
      upgrades,
      data.dark_upgrades[name],
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

  state.registerUpdate('dark', ct.update);
  refresh(state.player);
}
