/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

angular
.module('incremental')
.service('reaction',
['player',
'visibility',
'$rootScope',
function(player, visibility, $rootScope) {
  this.isReactionCostMet = function (number, reaction) {
    var keys = Object.keys(reaction.reactant);
    for(var i = 0; i < keys.length; i++) {
      var available = player.data.resources[keys[i]].number;
      var required = Number.parseFloat((number * reaction.reactant[keys[i]]).toFixed(4));
      if(required > available) {
        return false;
      }
    }
    return true;
  };

  this.react = function (number, reaction, player_data) {
    if(!Number.isInteger(number) || number <= 0) {
      return;
    }
    if(this.isReactionCostMet(number, reaction)) {
      var reactant = Object.keys(reaction.reactant);
      for(var i = 0; i < reactant.length; i++) {
        var required = Number.parseFloat((number * reaction.reactant[reactant[i]]).toFixed(4));
        player_data.resources[reactant[i]].number -= required;
        player_data.resources[reactant[i]].number = Number.parseFloat(player_data.resources[reactant[i]].number
            .toFixed(4));
      }
      var product = Object.keys(reaction.product);
      for(var i = 0; i < product.length; i++) {
        var produced = number * reaction.product[product[i]];
        var current = player_data.resources[product[i]].number;
        player_data.resources[product[i]].number = Number.parseFloat((current + produced).toFixed(4));
        if(!player_data.resources[product[i]].unlocked){
          player_data.resources[product[i]].unlocked = true;
          visibility.addNew(product[i]);
        }
      }
    }
  };
}]);
