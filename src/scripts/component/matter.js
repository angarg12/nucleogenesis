'use strict';

angular.module('game').component('matter', {
  templateUrl: 'views/matter.html',
  controller: ['state', 'visibility', 'data', 'generator', matter],
  controllerAs: 'ct'
});

function matter(state, visibility, data, generator) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;
  ct.generator = generator;

  ct.generatorPrice = function(name, element) {
    let level = state.player.elements[element].generators[name];
    let price = data.generators[name].price * Math.pow(data.generators[name].priceIncrease, level);
    return Math.ceil(price);
  };

  ct.buyGenerators = function(name, element, number) {
    let price = this.generatorPrice(name, element);
    let i = 0;
    // we need a loop since we use the ceil operator
    let currency = data.elements[element].main;
    while (i < number && state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.elements[element].generators[name]++;
      price = this.generatorPrice(name, element);
      i++;
    }
  };
}
