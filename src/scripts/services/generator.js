'use strict';

angular
  .module('game')
  .service('generator', ['state',
    'data',
    function(state, data) {
      this.generatorPrice = function(name, element) {
        let level = state.player.elements[element].generators[name];
        let price = data.generators[name].price * Math.pow(data.generators[name].priceIncrease, level);
        return Math.ceil(price);
      };

      this.buyGenerators = function(name, element, number) {
        let price = this.generatorPrice(name, element);
        let i = 0;
        // we need a loop since we use the ceil operator
        let currency = data.elements[element].main;
        while (i < number && state.player.resources[currency].number >= price) {
          state.player.resources[currency].number -= price;
          state.player.elements[element].generators[name]++;
          price = this.generatorPrice(name, element);
          i++;
        }
      };

      this.generatorProduction = function(name, element) {
        let baseProduction = data.generators[name].power;
        return this.upgradedProduction(baseProduction, name, element);
      };

      this.tierProduction = function(name, element) {
        let baseProduction = data.generators[name].power *
          state.player.elements[element].generators[name];
        return this.upgradedProduction(baseProduction, name, element);
      };

      this.upgradedProduction = function(production, name, element) {
        for (let up in data.generators[name].upgrades) {
          if (state.player.elements[element].upgrades[data.generators[name].upgrades[up]]) {
            let power = data.upgrades[data.generators[name].upgrades[up]].power;
            production = upgradeApply(production, power);
          }
        }
        let exotic = data.elements[element].exotic;
        production += production * state.player.resources[exotic].number * data.constants.EXOTIC_POWER;
        return Math.floor(production);
      };

      function upgradeApply(resource, power) {
        return resource * power;
      }

      this.elementProduction = function(element) {
        let total = 0;
        for (let tier in data.generators) {
          total += this.tierProduction(tier, element);
        }
        return total;
      };
    }
  ]);
