angular
.module('incremental')
.service('synthesis',
['player',
 'reaction',
 'data',
function(player, reaction, data) {
  var synthesis_price_increase = 1.15;
  var synthesis_power_increase = 2;

  this.synthesisMultiplier = function (synthesis) {
    var level = player.data.syntheses[synthesis].number;
    return Math.ceil(Math.pow(synthesis_price_increase, level));
  };

  this.synthesisPower = function (synthesis) {
    var level = player.data.syntheses[synthesis].active;
    return Math.ceil(Math.pow(level, synthesis_power_increase));
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

  this.processSynthesis = function () {
    // We will process the synthesis
    for(var synthesis in player.data.syntheses) {
      var power = this.synthesisPower(synthesis);
      if(power !== 0) {
        reaction.react(power, data.syntheses[synthesis]);
      }
    }
  };
}]);
