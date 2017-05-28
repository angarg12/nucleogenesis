'use strict';

angular.module('game').component('reactor', {
  templateUrl: 'views/reactor.html',
  controller: ['state', 'data', 'visibility', 'util', 'format', reactor],
  controllerAs: 'ct'
});

function reactor(state, data, visibility, util, format) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.visibility = visibility;
  ct.util = util;
  ct.format = format;

  ct.synthesisMultiplier = function (synthesis) {
    let level = state.player.syntheses[synthesis].number;
    return Math.ceil(Math.pow(data.constants.SYNTH_PRICE_INCREASE, level));
  };

  function synthesisPrice(synthesis) {
    let multiplier = ct.synthesisMultiplier(synthesis);
    let price = {};
    let reactant = data.syntheses[synthesis].reactant;
    for (let resource in reactant) {
      price[resource] = reactant[resource] * multiplier;
    }
    return price;
  }

  ct.isSynthesisCostMet = function (synthesis) {
    let price = synthesisPrice(synthesis);
    for (let resource in price) {
      if (state.player.resources[resource].number < price[resource]) {
        return false;
      }
    }
    return true;
  };

  ct.buySynthesis = function (synthesis, number) {
    let i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && ct.isSynthesisCostMet(synthesis)) {
      let price = synthesisPrice(synthesis);
      for (let resource in price) {
        state.player.resources[resource].number -= price[resource];
      }
      state.player.syntheses[synthesis].number += 1;
      i++;
    }
  };
}
