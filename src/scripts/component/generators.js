/**
 generators
 Component that handles generators, resource creation, isotopes and decay.

 @namespace Components
 */
'use strict';

angular.module('game').component('generators', {
  templateUrl: 'views/generators.html',
  controller: 'ct_generators',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_generators', ['state', 'visibility', 'data', 'util', 'reaction', 'upgrade',
  function (state, visibility, data, util, reaction, upgrade) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.buyAmount = [1, 10, 25, 100, 'max'];

    /* Proceses the decay of radiactive isotopes. It uses a random draw based on the
    half life to decide how many atoms decay, and then spreads them over different
    decay forms proportionally. */
    function processDecay(player) {
      // for each radiactive isotope
      for (let i = 0; i < data.radioisotopes.length; i++) {
        let resource = data.radioisotopes[i];
        if (player.resources[resource] !== null) {
          let number = player.resources[resource];
          let decay = data.resources[resource].decay;
          let halfLife = decay.half_life;
          let decayRate = Math.log(2)/halfLife;
          let totalProduction = number * decayRate;
          let remaining = Math.floor(totalProduction);
          // and decay products
          let highestRatio;
          for (let key in decay.decay_types) {
            let type = decay.decay_types[key];
            if(!highestRatio || highestRatio.ratio < type.ratio){
              highestRatio = type;
            }
            let production = totalProduction * type.ratio;
            // if production is less than one, do a random draw
            if(production < 1){
              let draw = Math.random();
              if(draw < production){
                production = 1;
              }
            }
            production = Math.floor(production);

            // FIXME: this is a hack to fix decay not working if the number of
            // neutrons is lower than the decay amount. Fixing starvation
            // should fix this one as well
            if (type.reaction.reactant && type.reaction.reactant.n) {
              production = Math.min(production, player.resources.n);
            }
            state.reactions.push({number: production, reaction:type.reaction});
            remaining -= production;
          }
          state.reactions.push({number: remaining, reaction: highestRatio.reaction});
        }
      }
    }

    /* Proceses the generation for each element. It generates isotopes with a random
    draw proportionally to their probability. */
    function processGenerators(player) {
      // we will simulate the production of isotopes proportional to their ratio
      for (let slot of player.element_slots) {
        if(!slot){
          continue;
        }
        let totalProduction = ct.elementProduction(player, slot);
        let remaining = totalProduction;
        // for each isotope
        for (let key in data.elements[slot.element].isotopes) {
          let isotope = data.elements[slot.element].isotopes[key];
          // we calculate the production proportion
          let production = isotope.ratio * totalProduction;
          // if production is less than one, do a random draw
          if(production < 1){
            let draw = Math.random();
            if(draw < production){
              production = 1;
            }
          }

          production = Math.floor(production);

          // assign the player the produced isotope
          util.addResource(player, [slot.element], key, production, state);

          // keep track of the remaining production
          remaining -= production;
        }
        // if there is remaining production, we assign it to the main isotope
        let main = data.elements[slot.element].main;
        // we don't want negative remaining
        remaining = Math.max(0, remaining);
        util.addResource(player, [slot.element], main, remaining, state);
      }
    }

    function update(player) {
      processDecay(player);
      processGenerators(player);
    }

    function generatorPrice(name, level) {
      return data.generators[name].price * Math.pow(data.generators[name].price_exp, level);
    }

    ct.maxCanBuy = function (player, name, slot) {
      let level = slot.generators[name];
      let i = 0;
      let currency = data.elements[slot.element].main;
      let price = generatorPrice(name, level);
      // we need a loop since we use the ceil operator
      while (player.resources[currency] >= price) {
        i++;
        price += generatorPrice(name, level + i);
      }
      return i;
    };

    ct.generatorTotalPrice = function (player, name, slot, number) {
      if (number === 'max') {
        number = ct.maxCanBuy(player, name, slot);
      }
      number = Math.max(number, 1);

      let level = slot.generators[name];
      let totalPrice = 0;
      for (let i = 0; i < number; i++) {
        let price = generatorPrice(name, level + i);
        totalPrice += Math.ceil(price);
      }
      return totalPrice;
    };

    ct.buyGenerators = function (player, name, slot, number) {
      if (number === 'max') {
        number = ct.maxCanBuy(player, name, slot);
      }
      let price = this.generatorTotalPrice(player, name, slot, number);
      let currency = data.elements[slot.element].main;
      if (ct.canBuy(player, slot, price)) {
        player.resources[currency] -= price;
        slot.generators[name] += number;
      }
    };

    ct.canBuy = function (player, slot, price) {
      let currency = data.elements[slot.element].main;
      if (price > player.resources[currency]) {
        return false;
      }
      return true;
    };

    ct.generatorProduction = function (player, name, slot) {
      let baseProduction = data.generators[name].power;
      return upgradedProduction(player, baseProduction, name, slot);
    };

    ct.tierProduction = function (player, name, slot) {
      let baseProduction = data.generators[name].power *
        slot.generators[name];
      return upgradedProduction(player, baseProduction, name, slot);
    };

    /* Upgraded production includes upgrades, exotic matter and dark matter. */
    function upgradedProduction(player, production, name, slot) {
      let args = {
        production: production,
        slot: slot
      };

      upgrade.executeAll(data.upgrades, slot.upgrades, [name, 'production'], args);

      // extract back the value from applying the upgrades
      let newProduction = args.production;

      let exotic = data.elements[slot.element].exotic;
      newProduction *= (1 + player.resources[exotic] * data.constants.EXOTIC_POWER) *
        (1 + player.resources.dark_matter * data.constants.DARK_POWER);
      return Math.floor(newProduction);
    }

    ct.elementProduction = function (player, slot) {
      let total = 0;
      for (let tier in data.generators) {
        total += ct.tierProduction(player, tier, slot);
      }
      return total;
    };

    ct.visibleGenerators = function (slot) {
      return visibility.visible(data.generators, isGeneratorVisible, slot);
    };

    function isGeneratorVisible(name, slot) {
      let generator = data.generators[name];
      for (let dep of generator.deps) {
        if (slot.generators[dep] === 0) {
          return false;
        }
      }

      return true;
    }

    state.registerUpdate('generators', update);
  }
]);
