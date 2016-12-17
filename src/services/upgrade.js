angular
.module('incremental')
.service('upgrade',
['player',
function(player) {  
  var $scope;
  
  this.setScope = function (scope){
    $scope = scope;
  };

  this.buyUpgrade = function (name, element) {
    if(player.data.elements[element].upgrades[name].bought) {
      return;
    }
    var price = $scope.upgrades[name].price;
    if(player.data.resources[element].number >= price) {
      player.data.resources[element].number -= price;
      player.data.elements[element].upgrades[name].bought = true;
    }
  };
  
  this.lastUpgradeTierPrice = function (tier) {
    for(var upgrade in $scope.generators[tier].upgrades) {
      if(!player.data.elements[$scope.current_element].upgrades[$scope.generators[tier].upgrades[upgrade]].bought) {
        return $scope.upgrades[$scope.generators[tier].upgrades[upgrade]].price;
      }
    }
    return null;
  };

  this.filterUpgrade = function (input) {
    return player.data.elements[$scope.current_element].generators[input].level > 0;
  };
}]);