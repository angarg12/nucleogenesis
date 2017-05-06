/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

angular
.module('incremental')
.service('generator',
['player',
'upgrade',
'data',
'$rootScope',
function(player, upgrade, data, $rootScope) {
  this.generatorPrice = function (name, element) {
    var level = player.data.elements[element].generators[name];
    var price = data.generators[name].price * Math.pow(data.generators[name].priceIncrease, level);
    return Math.ceil(price);
  };

  this.buyGenerators = function (name, element, number) {
    var price = this.generatorPrice(name, element);
    var i = 0;
    // we need a loop since we use the ceil operator
    var currency = data.elements[element].main;
    while (i < number && player.data.resources[currency].number >= price) {
      player.data.resources[currency].number -= price;
      player.data.elements[element].generators[name]++;
      price = this.generatorPrice(name, element);
      i++;
    }
  };

  this.generatorProduction = function (name, element) {
    var baseProduction = data.generators[name].power;
    return this.upgradedProduction(baseProduction, name, element);
  };

  this.tierProduction = function (name, element) {
    var baseProduction = data.generators[name].power *
                         player.data.elements[element].generators[name];
    return this.upgradedProduction(baseProduction, name, element);
  };

  this.upgradedProduction = function (production, name, element) {
    for(var up in data.generators[name].upgrades) {
        if(player.data.elements[element].upgrades[data.generators[name].upgrades[up]]) {
          let power = data.upgrades[data.generators[name].upgrades[up]].power;
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
