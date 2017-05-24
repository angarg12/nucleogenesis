'use strict';

angular.module('game').component('nova', {
  templateUrl: 'views/nova.html',
  controller: ['state', 'visibility', 'data', nova],
  controllerAs: 'ct'
});

function nova(state, visibility, data) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;

  ct.buyUpgrade = function(name, element) {
    if (state.player.elements[element].upgrades[name]) {
      return;
    }
    let price = data.upgrades[name].price;
    let currency = data.elements[element].main;
    if (state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.elements[element].upgrades[name] = true;
    }
  };

  ct.filterUpgrade = function(input) {
    return state.player.elements[state.currentElement].generators[input] > 0;
  };
}
