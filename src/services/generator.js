angular
.module('incremental')
.service('generator',
['player',
'upgrade',
'data',
function(player, upgrade, data) {
  var $scope;

  this.setScope = function (scope){
    $scope = scope;
  };

  this.generatorPrice = function (name, element) {
    var level = player.data.elements[element].generators[name].level;
    var price = data.generators[name].price * Math.pow(data.generators[name].priceIncrease, level);
    return Math.ceil(price);
  };

  this.buyGenerators = function (name, element, number) {
    var price = this.generatorPrice(name, element);
    var i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && player.data.resources[element].number >= price) {
      player.data.resources[element].number -= price;
      player.data.elements[element].generators[name].level++;
      price = this.generatorPrice(name, element);
      i++;
    }
    if(i > 0) {
      $scope.$emit("unlocks", name);
    }
  };

  this.generatorProduction = function (name, element) {
    var baseProduction = data.generators[name].power;
    return this.upgradedProduction(baseProduction, name, element);
  };

  this.tierProduction = function (name, element) {
    var baseProduction = data.generators[name].power *
                         player.data.elements[element].generators[name].level;
    return this.upgradedProduction(baseProduction, name, element);
  };

  this.upgradedProduction = function (production, name, element) {
    for(var up in data.generators[name].upgrades) {
        if(player.data.elements[element].upgrades[data.generators[name].upgrades[up]].bought) {
          power = data.upgrades[data.generators[name].upgrades[up]].power;
          production = upgrade.upgradeApply(production, power);
        }
      }
      return production;
  };

  this.elementProduction = function (element) {
    var total = 0;
    for(var tier in data.generators) {
      total += this.tierProduction(tier, element);
    }
    return total;
  };
}]);
