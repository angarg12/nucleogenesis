/**
 reactions
 Component that handles reactions and molecules.

 @namespace Components
 */
'use strict';

angular.module('game').component('reactions', {
  templateUrl: 'views/reactions.html',
  controller:  'ct_reactions',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_reactions', ['state', 'data', 'visibility', 'util', 'format', 'reaction',
function (state, data, visibility, util, format, reactionService) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.util = util;
  ct.format = format;

  function update(player) {
    for (let reaction of player.reactions) {
      if (!reaction.active) {
        continue;
      }
      reactionService.react(numberToReact(player, reaction.reaction), reaction.reaction, player);
    }
  }

  function numberToReact(player, reaction) {
    let power = ct.reactionPower(player);
    let number = power;
    for(let resource in reaction.reactants){
      number = Math.min(number, player.resources[resource].number);
    }
    return number;
  }

  /* Calculates the reaction power based on the reaction upgrades */
  ct.reactionPower = function(player) {
    let level = player.global_upgrades.reaction_bandwidth;
    let upgrade = data.global_upgrades.reaction_bandwidth;
    let basePower = upgrade.power;
    let polynomial = upgrade.power_poly;
    return basePower * Math.floor(Math.pow(level, polynomial));
  };

  /* Calculates the number of reaction slots based on the reaction upgrades */
  ct.reactionSlots = function (player) {
    let level = player.global_upgrades.reaction_slots;
    let upgrade = data.global_upgrades.reaction_slots;
    let basePower = upgrade.power;
    let multiplier = upgrade.power_mult;
    return basePower * Math.floor(multiplier * level);
  };

  ct.reactionSize = function (player) {
    return player.reactions.length;
  };

  /* Adds a new reaction to the player list */
  ct.addReaction = function (player, key) {
    if(ct.reactionSize(player) >= ct.reactionSlots(player)){
      return;
    }
    let reaction = data.reactions[key];
    player.reactions.push({
      active: false,
      reaction: angular.copy(reaction)
    });
  };

  ct.removeReaction = function (player, item) {
    for(let i = 0; i < player.reactions.length; i++){
      if(player.reactions[i] === item){
        player.reactions.splice(i, 1);
      }
    }
  };

  ct.visibleReactions = function(currentElement) {
    return visibility.visible(state.player.reactions, isReactionVisible, currentElement);
  };

  function isReactionVisible(entry, currentElement) {
    let reaction = entry.reaction;
    if(reaction.elements.length === 0 && currentElement === ''){
      return true;
    }
    for(let element of reaction.elements){
      if(element === currentElement){
        return true;
      }
    }
    return false;
  }

  ct.availableReactions = function(currentElement) {
    return visibility.visible(data.reactions, isReactionAvailable, currentElement);
  };

  function isReactionAvailable(entry, currentElement) {
    let available = true;
    let reaction = data.reactions[entry];
    for(let resource in reaction.reactant){
      available = available && state.player.resources[resource].unlocked;
    }
    // Workaround to reuse the visibility function. It expects an object with the
    // reaction inside
    let reactionObject = {reaction:reaction};
    return available && isReactionVisible(reactionObject, currentElement);
  }

  state.registerUpdate('reactions', update);
}]);
