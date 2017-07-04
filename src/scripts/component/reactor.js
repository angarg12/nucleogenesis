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
      let power = ct.synthesisPower(player, syn);
      if (power !== 0) {
        reaction.react(power, data.syntheses[syn], player);
      }
    }
  }

  ct.synthesisPower = function (player, synthesis) {
    let level = player.syntheses[synthesis].active;
    return Math.ceil(Math.pow(level, data.constants.SYNTH_POWER_INCREASE));
  };

  ct.synthesisMultiplier = function (player, synthesis) {
    let level = player.syntheses[synthesis].number;
    return Math.ceil(Math.pow(data.constants.SYNTH_PRICE_INCREASE, level));
  };

  function synthesisPrice(player, synthesis) {
    let multiplier = ct.synthesisMultiplier(player, synthesis);
    let price = {};
    let reactant = data.syntheses[synthesis].reactant;
    for (let resource in reactant) {
      price[resource] = reactant[resource] * multiplier;
    }
    return price;
  }

  ct.isSynthesisCostMet = function (player, synthesis) {
    let price = synthesisPrice(player, synthesis);
    for (let resource in price) {
      if (player.resources[resource].number < price[resource]) {
        return false;
      }
    }
    return true;
  };

  ct.buySynthesis = function (player, synthesis, number) {
    let i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && ct.isSynthesisCostMet(player, synthesis)) {
      let price = synthesisPrice(player, synthesis);
      for (let resource in price) {
        player.resources[resource].number -= price[resource];
      }
      player.syntheses[synthesis].number += 1;
      i++;
    }
  };

  state.registerUpdate('reactor', update);
}]);
