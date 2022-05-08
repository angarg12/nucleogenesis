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
  controller: 'ct_dark',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_dark', ['state', 'format', 'visibility', 'upgrade', 'data', 'util',
  function(state, format, visibility, upgrade, data, util) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;
    ct.cache = {
      breakdown: {}
    };

    ct.update = function(player) {
      refresh(player);
    };

    /* Refreshes the values in the cache */
    function refresh(player) {
      ct.cache.breakdown = {};
      for (let element in data.elements) {
        let exotic = data.elements[element].exotic;
        if (player.resources[exotic] === null || !player.statistics.dark_run[exotic]) {
          continue;
        }
        let number = player.statistics.dark_run[exotic];
        let darkProduction = util.prestigeProduction(number, data.constants.DARK_START, data.constants.DARK_STEP);
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

    ct.darkPrestige = function(player) {
      let production = ct.darkProduction();

      util.addResource(player, 'all_time', 'dark_matter', production, state);

      for (let key in data.elements) {
        let element = data.elements[key];
        if(player.resources[element.exotic] !== null){
          player.resources[element.exotic] = 0;
        }
        if (!player.exotic_upgrades[key]) {
          continue;
        }
        for (let up in data.exotic_upgrades) {
          player.exotic_upgrades[key][up] = false;
        }
      }
      for (let slot of player.element_slots) {
        if (!slot) {
          continue;
        }
        upgrade.resetElement(player, slot.element);
      }

      for (let i in player.element_slots) {
        player.element_slots[i] = null;
      }
      for(let fusion of player.fusion) {
        fusion.active = false;
        fusion.running = false;
      }
      player.statistics.exotic_run = {};
      player.statistics.dark_run = {};
    };

    ct.buyDarkUpgrade = function(name, player) {
      let upgrades = player.dark_upgrades;
      let price = data.dark_upgrades[name].price;
      let currency = 'dark_matter';
      upgrade.buyUpgrade(player,
        upgrades,
        data.dark_upgrades[name],
        name,
        price,
        currency);
    };

    ct.visibleDarkUpgrades = function(player) {
      return visibility.visible(data.dark_upgrades, isDarkUpgradeVisible, 0, null, player);
    };

    // here we receive not the name of the element, but the index in the element_slots
    function isDarkUpgradeVisible(name, index, player) {
      return visibility.isUpgradeVisible(name, index, data.dark_upgrades[name], player);
    }

    state.registerUpdate('dark', ct.update);
    refresh(state.player);
  }
]);
