'use strict';

angular
  .module('game')
  .service('element', ['state',
    'data',
    function(state, data) {
      this.elementPrice = function(element) {
        return Math.pow(2, state.player.elements_unlocked) * data.elements[element].number;
      };

      this.isElementCostMet = function(element) {
        let price = this.elementPrice(element);
        return state.player.resources['e-'].number >= price &&
          state.player.resources.p.number >= price &&
          state.player.resources.n.number >= price;
      };

      this.buyElement = function(element) {
        if (state.player.elements[element].unlocked) {
          return;
        }
        if (this.isElementCostMet(element)) {
          let price = this.elementPrice(element);
          state.player.resources['e-'].number -= price;
          state.player.resources.p.number -= price;
          state.player.resources.n.number -= price;

          state.player.elements[element].unlocked = true;
          state.player.elements[element].generators["1"] = 1;
          state.player.elements_unlocked++;
        }
      };
    }
  ]);
