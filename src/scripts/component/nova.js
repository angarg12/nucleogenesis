'use strict';

angular.module('game').component('nova', {
  templateUrl: 'views/nova.html',
  controller: ['state', 'visibility', 'data', nova],
  controllerAs: 'ct'
});

function nova(state, visibility, data) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;

  ct.buyUpgrade = function (name, element) {
    if (state.player.elements[element].upgrades[name]) {
      return;
    }
    let price = data.upgrades[name].price;
    let currency = data.elements[element].main;
    if (state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.elements[element].upgrades[name] = true;
    }
  };

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
}
