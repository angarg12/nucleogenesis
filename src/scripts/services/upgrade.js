'use strict';

angular
.module('incremental')
.service('upgrade',
['data',
'state',
function(data, state) {
  this.buyUpgrade = function (name, element) {
    if(state.player.elements[element].upgrades[name]) {
      return;
    }
    let price = data.upgrades[name].price;
    let currency = data.elements[element].main;
    if(state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.elements[element].upgrades[name] = true;
    }
  };

  this.lastUpgradeTierPrice = function (tier) {
    for(let upgrade in data.generators[tier].upgrades) {
      if(!state.player.elements[state.current_element].upgrades[data.generators[tier].upgrades[upgrade]]) {
        return data.upgrades[data.generators[tier].upgrades[upgrade]].price;
      }
    }
    return null;
  };

  this.filterUpgrade = function (input) {
    return state.player.elements[state.current_element].generators[input] > 0;
  };

  this.upgradeApply = function(resource, power) {
    return resource * power;
  };
}]);
