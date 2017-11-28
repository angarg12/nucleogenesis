/**
 upgrades
 Component that handles upgrades.

 @namespace Components
 */
'use strict';

angular.module('game').component('upgrades', {
  templateUrl: 'views/upgrades.html',
  controller: ['state', 'visibility', 'upgrade', 'data', upgrades],
  controllerAs: 'ct'
});

function upgrades(state, visibility, upgrade, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  let sortFunc = [
    (a,b) => data.upgrades[a].name < data.upgrades[b].name ? -1 : 1,
    (a,b) => data.upgrades[a].price - data.upgrades[b].price
  ]

  // tries to buy all the upgrades it can, starting from the cheapest
  ct.buyAll = function (slot) {
    let currency = data.elements[slot.element].main;
    let cheapest;
    let cheapestPrice;
    do{
      cheapest = null;
      cheapestPrice = Infinity;
      for(let up of ct.visibleUpgrades(slot, data.upgrades)){
        let price = data.upgrades[up].price;
        if(!slot.upgrades[up] &&
          price <= state.player.resources[currency].number){
          if(price < cheapestPrice){
            cheapest = up;
            cheapestPrice = price;
          }
        }
      }
      if(cheapest){
        upgrade.buyUpgrade(state.player,
          slot.upgrades,
          data.upgrades[cheapest],
          cheapest,
          cheapestPrice,
          currency);
      }
    }while(cheapest);
  };

  ct.buyUpgrade = function (name, slot) {
    let price = data.upgrades[name].price;
    let currency = data.elements[slot.element].main;
    upgrade.buyUpgrade(state.player,
      slot.upgrades,
      data.upgrades[name],
      name,
      price,
      currency);
  };

  ct.visibleUpgrades = function(slot) {
    return visibility.visible(data.upgrades, isBasicUpgradeVisible, slot, sortFunc[state.player.options.sortIndex]);
  };

  function isBasicUpgradeVisible(name, slot) {
    let isVisible = visibility.isUpgradeVisible(name, slot, data.upgrades[name]);
    return isVisible && (!state.player.options.hideBought || !slot.upgrades[name]);
  }
}
