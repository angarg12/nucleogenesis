'use strict';

angular.module('game').component('reactor', {
  templateUrl: 'views/reactor.html',
  controller:  'ct_reactor',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_reactor', ['state', 'data', 'visibility', 'util', 'format', 'reaction',
function (state, data, visibility, util, format, reaction) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.visibility = visibility;
  ct.util = util;
  ct.format = format;

  function update(player) {
    // We will process the synthesis
    for (let syn in player.syntheses) {
      let power = ct.synthesisPower(syn);
      if (power !== 0) {
        reaction.react(power, data.syntheses[syn], player);
      }
    }
  }

  ct.synthesisPower = function (synthesis) {
    let level = state.player.syntheses[synthesis].active;
    return Math.ceil(Math.pow(level, data.constants.SYNTH_POWER_INCREASE));
  };

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

  state.registerUpdate('reactor', update);
}]);
