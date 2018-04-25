/**
 upgrade
 Auxiliary services aimed to reduce duplication. The behaviour for upgrades,
 exotic upgrades and dark upgrades is almost the same. Also, both prestige loops
 require to reset an element.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('upgrade', ['data', 'util', '$controller', 'state', 'visibility',
    function(data, util, $controller, state, visibility) {
      let sv = this;

      <%= upgradeFunctions %>

      function update(player){
        sv.executeAll(data.dark_upgrades, player.dark_upgrades, ['cycle'], {player:player});
      }

      sv.buyUpgrade = function (player, upgrades, upgradeData, name, price, currency) {
        if (upgrades[name]) {
          return;
        }
        if (player.resources[currency] >= price) {
          player.resources[currency] -= price;
          upgrades[name] = true;
          let args = {player: player};
          sv.executeOnce(upgradeData, ['once'], args);
        }
      };

      sv.resetElement = function(player, element) {
        let resources = player.resources;
        for (let resource of data.elements[element].includes) {
          if(resources[resource] !== null){
            resources[resource] = 0;
          }
        }
      };

      sv.executeOnce = function(upgrade, tags, args) {
        for(let tag of tags){
          if((upgrade.tags || []).indexOf(tag) === -1){
            return;
          }
        }
        let func = upgrade.function;
        if(func){
          sv[func](args);
        }
      };

      sv.executeAll = function(upgradesData, playerUpgrades, tags, args){
		if(!playerUpgrades) return;
		
        for(let key in upgradesData){
          if(!playerUpgrades[key]){
            continue;
          }
          let upgrade = upgradesData[key];
          sv.executeOnce(upgrade, tags, args);
        }
      };

      sv.filterByTag = function(tag) {
        return (name) => data.global_upgrades[name].tags.indexOf(tag) !== -1;
      };

      sv.priceMultiplier = function (name, player) {
        let level = player.global_upgrades[name];
        return Math.ceil(Math.pow(data.global_upgrades[name].price_exp, level));
      };

      /* Global upgrades are non-resource specific, repeatable upgrades */
      sv.buyGlobalUpgrade = function (name, player) {
        if (!sv.canBuyGlobalUpgrade(name, player)) {
          return;
        }

        let up = data.global_upgrades[name];
        for (let currency in up.price) {
          let value = up.price[currency] * sv.priceMultiplier(name, player);
          player.resources[currency] -= value;
        }

        player.global_upgrades[name]++;
      };

      sv.canBuyGlobalUpgrade = function (name, player) {
        let up = data.global_upgrades[name];
        for (let currency in up.price) {
          let value = up.price[currency] * sv.priceMultiplier(name, player);
          if (player.resources[currency] < value) {
            return false;
          }
        }

        return true;
      };

      // tries to buy all the upgrades it can, starting from the cheapest
      sv.buyAll = function (player, playerUpgrades, visibleUpgrades, dataUpgrades, currency) {
        let cheapest;
        let cheapestPrice;
        
        do{
          cheapest = null;
          cheapestPrice = Number.MAX_VALUE;
          for(let up of visibleUpgrades){
            let price = dataUpgrades[up].price;
            if(!playerUpgrades[up] &&
              price <= player.resources[currency]){
              if(price < cheapestPrice){
                cheapest = up;
                cheapestPrice = price;
              }
            }
          }
          if(cheapest){
            sv.buyUpgrade(player,
              playerUpgrades,
              dataUpgrades[cheapest],
              cheapest,
              cheapestPrice,
              currency);
          }
        }while(cheapest);
      };

      sv.sortFunctions = function(data){
        return [
          function(a,b) {
            let compare = data[a].name.localeCompare(data[b].name, undefined, {numeric: true, sensitivity: 'base'});
            if(compare === 0) return data[a].price - data[b].price;
            return compare;
          },
          (a,b) => data[a].price - data[b].price
        ];
      };

      state.registerUpdate('upgrade_service', update);
    }
  ]);
