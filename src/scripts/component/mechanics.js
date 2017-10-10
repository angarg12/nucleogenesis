/**
 mechanics
 Component that handles the logic of purchasing new mechancs, plus global upgrades.

 @namespace Components
 */
'use strict';

angular.module('game').component('mechanics', {
  templateUrl: 'views/mechanics.html',
  controller: ['state', 'visibility', 'data', mechanics
  ],
  controllerAs: 'ct'
});

function mechanics (state, visibility, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;

  ct.unlockMechanic = function(player, mechanic) {
    if(ct.unlockedMechanics(player) >= player.mechanic_slots){
      return;
    }
    player.mechanics[mechanic] = true;
  };

  ct.unlockedMechanics = function(player) {
    let count = 0;
    for(let key in player.mechanics){
      if(player.mechanics[key]){
        count++;
      }
    }
    return count;
  };

  /* Global upgrades are non-resource specific, repeatable upgrades */
  ct.buyGlobalUpgrade = function (name) {
    if (!ct.canBuyGlobalUpgrade(name)) {
      return;
    }

    let up = data.global_upgrades[name];
    for (let currency in up.price) {
      let value = up.price[currency] * ct.priceMultiplier(name);
      state.player.resources[currency].number -= value;
    }

    state.player.global_upgrades[name]++;
  };

  ct.canBuyGlobalUpgrade = function (name) {
    let up = data.global_upgrades[name];
    for (let currency in up.price) {
      let value = up.price[currency] * ct.priceMultiplier(name);
      if (state.player.resources[currency].number < value) {
        return false;
      }
    }

    return true;
  };

  ct.priceMultiplier = function (name) {
    let level = state.player.global_upgrades[name];
    return Math.ceil(Math.pow(data.global_upgrades[name].price_exp, level));
  };

  ct.visibleMechanicUpgrades = function() {
    return visibility.visible(data.global_upgrades, isMechanicUpgradeVisible);
  };

  function isMechanicUpgradeVisible(name) {
    let mechanic = data.global_upgrades[name].mechanic;
    return state.player.mechanics[mechanic];
  }
}
