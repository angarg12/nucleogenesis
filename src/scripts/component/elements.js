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
  let buyAmount = [1, 10, 25, 100, 'max'];

  ct.getChance = function(element) {
    let bonus = 0;
    for(let isotope in data.elements[element].isotopes){
      bonus += state.player.resources[isotope].number*data.constants.ELEMENT_CHANCE_BONUS;
    }
    let singleChance = data.elements[element].abundance*(1+bonus);
    let chance = 1 - Math.pow(Math.max(0, 1-singleChance), ct.getbuyAmount(state.player));

    return Math.min(1, chance);
  };

  ct.buyElement = function (element) {
    if (state.player.elements[element]) {
      return;
    }
    if (state.player.resources.dark_matter.number >= ct.elementPrice) {
      state.player.resources.dark_matter.number -= ct.elementPrice;

      if(Math.random() < ct.getChance(element)){
        state.player.elements[element] = true;
        state.player.exotic_upgrades[element] = {};
        for(let up in data.exotic_upgrades){
          state.player.exotic_upgrades[element][up] = false;
        }
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
    if (state.player.elements[element]) {
      return 'element_purchased';
    }
    if (isElementAvailable(element)) {
      return 'element_available';
    }
    return 'element_unavailable';
  };

  function isElementAvailable(element) {
    for(let resource of data.elements[element].includes){
      if(state.player.resources[resource].unlocked){
        return true;
      }
    }
    return false;
  }

  /* This function returns the class that determines the secondary
  colour of an element card */
  ct.elementSecondaryClass = function (element) {
    return ct.elementClass(element) + '_dark';
  };

  ct.nextBuyAmount = function () {
    state.elementBuyIndex = (state.elementBuyIndex + 1) % buyAmount.length;
  };

  ct.getbuyAmount = function (player) {
    let result = buyAmount[state.elementBuyIndex];
    if(result === 'max'){
      result = player.resources.dark_matter.number;
    }
    return result;
  };
}
