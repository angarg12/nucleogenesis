/**
 reactor
 Component that handles reactions and molecules.

 @namespace Components
 */
'use strict';

angular.module('game').component('reactor', {
  templateUrl: 'views/reactor.html',
  controller:  'ct_reactor',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_reactor', ['state', 'data', 'visibility', 'util', 'format', 'reaction',
function (state, data, visibility, util, format, reactionService) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.visibility = visibility;
  ct.util = util;
  ct.format = format;

  function update(player) {
    // We will process the reaction
    for (let syn in player.reactions) {
      let power = ct.reactionPower(player, syn);
      if (power !== 0) {
        reactionService.react(power, data.reactions[syn], player);
      }
    }
  }

  ct.reactionPower = function (player, reaction) {
    let level = player.reactions[reaction].active;
    return Math.ceil(Math.pow(level, data.constants.REACT_POWER_INCREASE));
  };

  ct.reactionPriceMultiplier = function (player, reaction) {
    let level = player.reactions[reaction].number;
    return Math.ceil(Math.pow(data.constants.REACT_PRICE_INCREASE, level));
  };

  function reactionPrice(player, reaction) {
    let multiplier = ct.reactionPriceMultiplier(player, reaction);
    let price = {};
    let reactant = data.reactions[reaction].reactant;
    for (let resource in reactant) {
      price[resource] = reactant[resource] * multiplier;
    }
    return price;
  }

  ct.isReactionCostMet = function (player, reaction) {
    let price = reactionPrice(player, reaction);
    for (let resource in price) {
      if (player.resources[resource].number < price[resource]) {
        return false;
      }
    }
    return true;
  };

  ct.buyReaction = function (player, reaction, number) {
    let i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && ct.isReactionCostMet(player, reaction)) {
      let price = reactionPrice(player, reaction);
      for (let resource in price) {
        player.resources[resource].number -= price[resource];
      }
      player.reactions[reaction].number += 1;
      i++;
    }
  };

  state.registerUpdate('reactor', update);
}]);
