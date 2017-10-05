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

      <%= fireOnceFunctions %>

      this.buyUpgrade = function (player, upgrades, upgradeData, name, price, currency) {
        if (upgrades[name]) {
          return;
        }
        if (player.resources[currency].number >= price) {
          player.resources[currency].number -= price;
          upgrades[name] = true;
          let func = upgradeData.fire_once_function;
          if(func){
            sv[func](player);
          }
        }
      };

      this.resetElement = function(player, element) {
        let exotic = data.elements[element].exotic;
        if (!player.resources[exotic].unlocked) {
          return;
        }

        let resources = player.resources;
        for (let resource of data.elements[element].includes) {
          resources[resource].number = 0;
        }
      };
    }
  ]);
