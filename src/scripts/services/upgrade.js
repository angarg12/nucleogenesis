'use strict';

angular
.module('incremental')
.service('upgrade',
['player',
'data',
'state',
function(player, data, state) {
  this.buyUpgrade = function (name, element) {
    if(player.data.elements[element].upgrades[name]) {
      return;
    }
    var price = data.upgrades[name].price;
    var currency = data.elements[element].main;
    if(player.data.resources[currency].number >= price) {
      player.data.resources[currency].number -= price;
      player.data.elements[element].upgrades[name] = true;
    }
  };

  this.lastUpgradeTierPrice = function (tier) {
    for(var upgrade in data.generators[tier].upgrades) {
      if(!player.data.elements[state.current_element].upgrades[data.generators[tier].upgrades[upgrade]]) {
        return data.upgrades[data.generators[tier].upgrades[upgrade]].price;
      }
    }
    return null;
  };

  this.filterUpgrade = function (input) {
    return player.data.elements[state.current_element].generators[input] > 0;
  };

  this.upgradeApply = function(resource, power) {
    return resource * power;
  };
}]);
