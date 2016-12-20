angular
.module('incremental')
.service('reaction',
['player',
function(player) {
  var $scope;
  
  this.setScope = function (scope){
    $scope = scope;
  };
  
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

  this.react = function (number, reaction) {
    if(!Number.isInteger(number) || number <= 0) {
      return;
    }
    if(this.isReactionCostMet(number, reaction)) {
      var reactant = Object.keys(reaction.reactant);
      for(var i = 0; i < reactant.length; i++) {
        var required = Number.parseFloat((number * reaction.reactant[reactant[i]]).toFixed(4));
        player.data.resources[reactant[i]].number -= required;
        player.data.resources[reactant[i]].number = Number.parseFloat(player.data.resources[reactant[i]].number
            .toFixed(4));
      }
      var product = Object.keys(reaction.product);
      for(var i = 0; i < product.length; i++) {
        var produced = number * reaction.product[product[i]];
        var current = player.data.resources[product[i]].number;
        player.data.resources[product[i]].number = Number.parseFloat((current + produced).toFixed(4));
        $scope.$emit("resource", product[i]);
      }
    }
  };
}]);