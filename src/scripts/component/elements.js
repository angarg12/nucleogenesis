/**
 elements
 Component that handles the periodic table tab.
 It includes the logic to purchase and display elements.

 @namespace Components
 */
'use strict';

angular.module('game').component('elements', {
  templateUrl: 'views/elements.html',
  controller: ['$timeout', 'state', 'data', elements],
  controllerAs: 'ct'
});

function elements($timeout, state, data) {
  let ct = this;
  ct.elementPrice = 1;
  ct.state = state;
  ct.data = data;
  ct.outcome = {};

  ct.getChance = function(element) {
    let bonus = 0;
    for(let isotope in data.elements[element].isotopes){
      bonus += state.player.resources[isotope].number*data.constants.ELEMENT_CHANCE_BONUS;
    }
    return Math.min(1, data.elements[element].abundance*(1+bonus));
  };

  ct.buyElement = function (element) {
    if (state.player.elements[element].unlocked) {
      return;
    }
    if (state.player.resources.dark_matter.number >= ct.elementPrice) {
      state.player.resources.dark_matter.number -= ct.elementPrice;

      if(Math.random() < ct.getChance(element)){
        state.player.elements[element].unlocked = true;
        state.player.elements[element].generators['1'] = 1;
        state.player.elements_unlocked++;
        ct.outcome[element] = 'Success';
      }else{
        ct.outcome[element] = 'Fail';
      }
      $timeout(function(){ct.clearMessage(element);}, 1000)
    }
  };

  ct.clearMessage = function (element) {
    ct.outcome[element] = '';
  };

  /* This function returns the class that determines on which
  colour an element card */
  ct.elementClass = function (element) {
    if(!state.player.elements[element]){
      return 'element_unavailable';
    }
    if (state.player.elements[element].unlocked) {
      return 'element_purchased';
    }else{
      if(state.player.resources.dark_matter.number >= ct.elementPrice) {
        return 'element_cost_met';
      }else{
        return 'element_cost_not_met';
      }
    }
  };

  /* This function returns the class that determines the secondary
  colour of an element card */
  ct.elementSecondaryClass = function (element) {
    return ct.elementClass(element) + '_dark';
  };
}
