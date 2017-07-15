'use strict';

angular
  .module('game')
  .service('upgrade', ['data',
    function(data) {
      this.buyUpgrade = function (player, upgrades, name, price, currency) {
        if (upgrades[name]) {
          return;
        }
        if (player.resources[currency].number >= price) {
          player.resources[currency].number -= price;
          upgrades[name] = true;
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

        let upgrades = player.elements[element].upgrades;
        for (let upgrade in upgrades) {
          upgrades[upgrade] = false;
        }

        let generators = player.elements[element].generators;
        for (let generator in generators) {
          generators[generator] = 0;
        }

        let syntheses = data.elements[element].syntheses;
        for (let synthesis of syntheses) {
          player.syntheses[synthesis].active = 0;
        }
        delete generators['0'];
        let first = Object.keys(generators)[0];

        player.elements[element].generators[first] = 1;
      };
    }
  ]);
