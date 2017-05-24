'use strict';

angular
  .module('game')
  .service('synthesis', ['state',
    'reaction',
    'data',
    function(state, reaction, data) {
      this.synthesisMultiplier = function(synthesis) {
        let level = state.player.syntheses[synthesis].number;
        return Math.ceil(Math.pow(data.constants.SYNTH_PRICE_INCREASE, level));
      };

      this.synthesisPower = function(synthesis) {
        let level = state.player.syntheses[synthesis].active;
        return Math.ceil(Math.pow(level, data.constants.SYNTH_POWER_INCREASE));
      };

      this.synthesisPrice = function(synthesis) {
        let multiplier = this.synthesisMultiplier(synthesis);
        let price = {};
        let reactant = data.syntheses[synthesis].reactant;
        for (let resource in reactant) {
          price[resource] = reactant[resource] * multiplier;
        }
        return price;
      };

      this.isSynthesisCostMet = function(synthesis) {
        let price = this.synthesisPrice(synthesis);
        for (let resource in price) {
          if (state.player.resources[resource].number < price[resource]) {
            return false;
          }
        }
        return true;
      };

      this.buySynthesis = function(synthesis, number) {
        let i = 0;
        // we need a loop since we use the ceil operator
        while (i < number && this.isSynthesisCostMet(synthesis)) {
          let price = this.synthesisPrice(synthesis);
          for (let resource in price) {
            state.player.resources[resource].number -= price[resource];
          }
          state.player.syntheses[synthesis].number += 1;
          i++;
        }
      };
    }
  ]);
