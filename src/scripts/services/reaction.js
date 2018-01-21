/**
 reaction
 Service that processes a reaction i.e. it converts reactants to products.
 Many phenomenons, including decay, redox and reactions, use the react function.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('reaction', ['state','util','data',
    function(state, util, data) {
      // FIXME: move to util?
        function isReactionCostMet (number, reaction, playerData) {
          for (let key in reaction.reactant) {
            let available = playerData.resources[key];
            let required = number * reaction.reactant[key];
            if (required > available) {
              return false;
            }
          }
          return true;
        }

      /* Transforms reactants to products */
      this.react = function(number, reaction, playerData) {
        if (!Number.isInteger(number) || number <= 0 ||
            !reaction.reactant || !reaction.product) {
          return;
        }
        if (isReactionCostMet(number, reaction, playerData)) {
          let elements = [];
          for (let resource in reaction.reactant) {
            let required = number * reaction.reactant[resource];
            playerData.resources[resource] -= required;
            playerData.resources[resource] = playerData.resources[resource];
            // We track which elements produced the products, for the statistics
            for(let elem of Object.keys(data.resources[resource].elements)){
              if(elements.indexOf(elem) === -1){
                elements.push(elem);
              }
            }
          }
          for (let resource in reaction.product) {
            let produced = number * reaction.product[resource];
            util.addResource(playerData, elements, resource, produced, state);
          }
        }
      };

      this.processReactions = function(reactions, player){
        let declared = {};
        for(let reaction of reactions){
          let reactant = reaction.reaction.reactant;
          for (let resource in reactant) {
            declared[resource] = declared[resource]+reactant[resource]*reaction.number || reactant[resource]*reaction.number;
          }
        }
        for(let reaction of reactions){
          let reactant = reaction.reaction.reactant;
          for (let resource in reactant) {
            if(!declared[resource] || !reactant[resource]){
              continue;
            }
            let available = Math.min(declared[resource], player.resources[resource]);
            let ratio = reactant[resource]*reaction.number/declared[resource];
            reaction.number = Math.min(reaction.number, Math.floor(available*ratio));
          }
        }

        for(let reaction of reactions){
          this.react(reaction.number, reaction.reaction, player);
        }
      }
    }
  ]);
