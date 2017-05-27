'use strict';

angular.module('game').component('core', {
  templateUrl: 'views/core.html',
  controller: ['state', 'data', core],
  controllerAs: 'ct'
});

function core(state, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;

  ct.elementPrice = function (element) {
    return Math.pow(2, state.player.elements_unlocked) * data.elements[element].number;
  };

  ct.isElementCostMet = function (element) {
    let price = this.elementPrice(element);
    return state.player.resources['e-'].number >= price &&
      state.player.resources.p.number >= price &&
      state.player.resources.n.number >= price;
  };

  ct.buyElement = function (element) {
    if (state.player.elements[element].unlocked) {
      return;
    }
    if (this.isElementCostMet(element)) {
      let price = this.elementPrice(element);
      state.player.resources['e-'].number -= price;
      state.player.resources.p.number -= price;
      state.player.resources.n.number -= price;

      state.player.elements[element].unlocked = true;
      state.player.elements[element].generators['1'] = 1;
      state.player.elements_unlocked++;
    }
  };

  ct.elementClass = function (element) {
    // FIXME: when all elements are implemented, this can be removed
    if (data.elements[element]) {
      if(!state.player.elements[element]){
        return 'element_unavailable';
      }
      if (state.player.elements[element].unlocked) {
        return 'element_purchased';
      }else{
        if(ct.isElementCostMet(element)) {
          return 'element_cost_met';
        }else{
          return 'element_cost_not_met';
        }
      }
    }else{
      return null;
    }
  };

  ct.elementSecondaryClass = function (element) {
    return ct.elementClass(element) + '_dark';
  };
}
