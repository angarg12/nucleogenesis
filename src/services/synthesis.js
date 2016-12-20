angular
.module('incremental')
.service('synthesis',
['player',
 'reaction',
function(player, reaction) {  
  var $scope;
  var synthesis_price_increase = 1.15;
  var synthesis_power_increase = 2;
  
  this.setScope = function (scope){
    $scope = scope;
  };

  this.synthesisMultiplier = function (synthesis) {
    var level = player.data.synthesis[synthesis].number;
    return Math.ceil(Math.pow(synthesis_price_increase, level));
  };

  this.synthesisPower = function (synthesis) {
    var level = player.data.synthesis[synthesis].active;
    return Math.ceil(Math.pow(level, synthesis_power_increase));
  };

  this.synthesisPrice = function (synthesis) {
    var multiplier = this.synthesisMultiplier(synthesis);
    var price = {};
    var reactant = $scope.synthesis[synthesis].reactant;
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
      player.data.synthesis[synthesis].number += 1;
      i++;
    }
  };
  
  this.processSynthesis = function () {
    // We will process the synthesis reactions
    for(var synthesis in player.data.synthesis) {
      var power = this.synthesisPower(synthesis);
      if(power !== 0) {
        reaction.react(power, $scope.synthesis[synthesis]);
      }
    }
  };
}]);