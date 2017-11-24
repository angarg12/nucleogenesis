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
          let keys = Object.keys(reaction.reactant);
          for (let i = 0; i < keys.length; i++) {
            let available = playerData.resources[keys[i]].number;
            let required = number * reaction.reactant[keys[i]];
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
          let reactant = Object.keys(reaction.reactant);
          let elements = [];
          for (let i = 0; i < reactant.length; i++) {
            let required = number * reaction.reactant[reactant[i]];
            playerData.resources[reactant[i]].number -= required;
            playerData.resources[reactant[i]].number = playerData.resources[reactant[i]].number;
            // We track which elements produced the products, for the statistics
            for(let elem of Object.keys(data.resources[reactant[i]].elements)){
              if(elements.indexOf(elem) === -1) elements.push(elem);
            }
          }
          let product = Object.keys(reaction.product);
          for (let i = 0; i < product.length; i++) {
            let produced = number * reaction.product[product[i]];

            util.addResource(playerData, elements, product[i], produced);
          }
        }
      };
    }
  ]);
