/**
 upgrades
 Component that handles upgrades.

 @namespace Components
 */
'use strict';

angular.module('game').component('upgrades', {
  templateUrl: 'views/upgrades.html',
  controller: 'ct_upgrades',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_upgrades', ['state', 'visibility', 'upgrade', 'data',
function(state, visibility, upgradeService, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.upgradeService = upgradeService;
  let sortFunc = upgradeService.sortFunctions(data.upgrades);

  ct.buyUpgrade = function (name, slot, player) {
    let price = data.upgrades[name].price;
    let currency = data.elements[slot.element].main;
    upgradeService.buyUpgrade(player,
      slot.upgrades,
      data.upgrades[name],
      name,
      price,
      currency);
  };

  ct.visibleUpgrades = function(slot, player) {
    return visibility.visible(data.upgrades, isBasicUpgradeVisible, slot, sortFunc[player.options.sortIndex], player);
  };

  function isBasicUpgradeVisible(name, slot, player) {
    let isVisible = visibility.isUpgradeVisible(name, slot, data.upgrades[name], player);
    return isVisible && (!player.options.hideBought || !slot.upgrades[name]);
  }

  ct.visibleGlobalUpgrades = function() {
    return visibility.visible(data.global_upgrades, upgradeService.filterByTag('global'));
  };
}
]);
