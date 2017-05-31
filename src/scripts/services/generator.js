'use strict';

angular
  .module('game')
  .service('generator', ['state',
    'data',
    function(state, data) {
      this.generatorProduction = function(name, element) {
        let baseProduction = data.generators[name].power;
        return upgradedProduction(baseProduction, name, element);
      };

      this.tierProduction = function(name, element) {
        let baseProduction = data.generators[name].power *
          state.player.elements[element].generators[name];
        return upgradedProduction(baseProduction, name, element);
      };

      function upgradedProduction(production, name, element) {
        for (let up in data.generators[name].upgrades) {
          if (state.player.elements[element].upgrades[data.generators[name].upgrades[up]]) {
            let power = data.upgrades[data.generators[name].upgrades[up]].power;
            production = upgradeApply(production, power);
          }
        }
        let exotic = data.elements[element].exotic;
        production += production * state.player.resources[exotic].number * data.constants.EXOTIC_POWER;
        return Math.floor(production);
      }

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
