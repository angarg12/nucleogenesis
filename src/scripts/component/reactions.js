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
  ct.adjustAmount = [1, 10, 25, 100];

  function update(player) {
    for(let slot of player.element_slots){
      if(!slot){
        continue;
      }
      for (let reaction of slot.reactions) {
        if (!reaction.active) {
          continue;
        }
        reactionService.react(numberToReact(player, reaction.reaction), reaction.reaction, player);
      }
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
    let level = player.global_upgrades_current.reaction_bandwidth;
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
    let size = 0;
    for(let slot of player.element_slots){
      if(!slot){
        continue;
      }
      size += slot.reactions.length;
    }
    return size;
  };

  /* Adds a new reaction to the player list */
  ct.addReaction = function (player, slot, key) {
    if(ct.reactionSize(player) >= ct.reactionSlots(player)){
      return;
    }
    let reaction = data.reactions[key];
    slot.reactions.push({
      active: false,
      reaction: angular.copy(reaction)
    });
  };

  ct.removeReaction = function (slot, item) {
    for(let i = 0; i < slot.reactions.length; i++){
      if(slot.reactions[i] === item){
        slot.reactions.splice(i, 1);
      }
    }
  };

  ct.visibleReactions = function(slot) {
    return slot.reactions;
  };

  ct.availableReactions = function(slot) {
    return visibility.visible(data.reactions, isReactionAvailable, slot.element);
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

  function isReactionVisible(entry, currentElement) {
    let reaction = entry.reaction;
    if(reaction.elements.length === 0){
      return true;
    }
    for(let element of reaction.elements){
      if(element === currentElement){
        return true;
      }
    }
    return false;
  }

  ct.adjustLevel = function(player, upgrade, amount){
    player.global_upgrades_current[upgrade] += amount;
    // We cap it between 1 and the current max level
    player.global_upgrades_current[upgrade] = Math.max(1, Math.min(player.global_upgrades_current[upgrade], player.global_upgrades[upgrade]));
  };

  state.registerUpdate('reactions', update);
}]);
