/**
 nova
 Component that handles upgrades.

 @namespace Components
 */
'use strict';

angular.module('game').component('nova', {
  templateUrl: 'views/nova.html',
  controller: ['state', 'visibility', 'upgrade', 'data', nova],
  controllerAs: 'ct'
});

function nova(state, visibility, upgrade, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;

  ct.buyUpgrade = function (name, element) {
    let upgrades = state.player.elements[element].upgrades;
    let price = data.upgrades[name].price;
    let currency = data.elements[element].main;
    upgrade.buyUpgrade(state.player,
      upgrades,
      name,
      price,
      currency);
  };

  /* Global upgrades are non-resource specific, repeatable upgrades */
  ct.buyGlobalUpgrade = function (name) {
    if (!ct.canBuyGlobalUpgrade(name)) {
      return;
    }

    let upgrade = data.global_upgrades[name];
    for (let currency in upgrade.price) {
      let value = upgrade.price[currency] * ct.priceMultiplier(name);
      state.player.resources[currency].number -= value;
    }

    state.player.global_upgrades[name]++;
  };

  ct.canBuyGlobalUpgrade = function (name) {
    let upgrade = data.global_upgrades[name];
    for (let currency in upgrade.price) {
      let value = upgrade.price[currency] * ct.priceMultiplier(name);
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

  ct.visibleUpgrades = function(currentElement) {
    return visibility.visible(data.upgrades, isBasicUpgradeVisible, currentElement);
  };

  function isBasicUpgradeVisible(name, currentElement) {
    return visibility.isUpgradeVisible(name, currentElement, data.upgrades[name]);
  }
}
