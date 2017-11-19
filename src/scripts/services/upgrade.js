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
  .service('upgrade', ['data',
    function(data) {
      let sv = this;

      <%= upgradeFunctions %>

      sv.buyUpgrade = function (player, upgrades, upgradeData, name, price, currency) {
        if (upgrades[name]) {
          return;
        }
        if (player.resources[currency].number >= price) {
          player.resources[currency].number -= price;
          upgrades[name] = true;
          let args = {player: player};
          sv.executeOnce(upgradeData, ['once'], args);
        }
      };

      sv.resetElement = function(player, element) {
        let resources = player.resources;
        for (let resource of data.elements[element].includes) {
          resources[resource].number = 0;
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
        for(let key in upgradesData){
          if(!playerUpgrades[key]){
            continue;
          }
          let upgrade = upgradesData[key];
          sv.executeOnce(upgrade, tags, args);
        }
      }
    }
  ]);
