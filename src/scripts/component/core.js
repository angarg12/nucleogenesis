/**
 core
 Component that handles the periodic table tab.
 It includes the logic to purchase and display elements.

 @namespace Components
 */
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
    return Math.floor(Math.pow(data.constants.ELEMENT_PRICE_BASE, state.player.elements_unlocked) *
                              data.elements[element].number);
  };

   function isElementCostMet(element) {
    let price = ct.elementPrice(element);
    return state.player.resources.dark_matter.number >= price;
  }

  ct.buyElement = function (element) {
    if (state.player.elements[element].unlocked) {
      return;
    }
    if (isElementCostMet(element)) {
      let price = ct.elementPrice(element);
      state.player.resources.dark_matter.number -= price;

      state.player.elements[element].unlocked = true;
      state.player.elements[element].generators['1'] = 1;
      state.player.elements_unlocked++;
    }
  };

  /* This function returns the class that determines on which
  colour an element card */
  ct.elementClass = function (element) {
    // FIXME: when all elements are implemented, this can be removed
    if (data.elements[element]) {
      if(!state.player.elements[element]){
        return 'element_unavailable';
      }
      if (state.player.elements[element].unlocked) {
        return 'element_purchased';
      }else{
        if(isElementCostMet(element)) {
          return 'element_cost_met';
        }else{
          return 'element_cost_not_met';
        }
      }
    }else{
      return null;
    }
  };

  /* This function returns the class that determines the secondary
  colour of an element card */
  ct.elementSecondaryClass = function (element) {
    return ct.elementClass(element) + '_dark';
  };
}
