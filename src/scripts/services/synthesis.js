'use strict';

angular
.module('incremental')
.service('synthesis',
['player',
 'reaction',
 'data',
function(player, reaction, data) {
  const PRICE_INCREASE = 1.15;
  const POWER_INCREASE = 2;

  this.synthesisMultiplier = function (synthesis) {
    var level = player.data.syntheses[synthesis].number;
    return Math.ceil(Math.pow(PRICE_INCREASE, level));
  };

  this.synthesisPower = function (synthesis) {
    var level = player.data.syntheses[synthesis].active;
    return Math.ceil(Math.pow(level, POWER_INCREASE));
  };

  this.synthesisPrice = function (synthesis) {
    var multiplier = this.synthesisMultiplier(synthesis);
    var price = {};
    var reactant = data.syntheses[synthesis].reactant;
    for(var resource in reactant) {
      price[resource] = reactant[resource] * multiplier;
    }
    return price;
  };

  this.isSynthesisCostMet = function (synthesis) {
    var price = this.synthesisPrice(synthesis);
    for(var resource in price) {
      if(player.data.resources[resource].number < price[resource]) {
        return false;
      }
    }
    return true;
  };

  this.buySynthesis = function (synthesis, number) {
    var i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && this.isSynthesisCostMet(synthesis)) {
      var price = this.synthesisPrice(synthesis);
      for(var resource in price) {
        player.data.resources[resource].number -= price[resource];
      }
      player.data.syntheses[synthesis].number += 1;
      i++;
    }
  };
}]);
