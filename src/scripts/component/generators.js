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

angular.module('game').controller('ct_generators', ['state', 'visibility', 'data', 'util', 'reaction',
  function (state, visibility, data, util, reaction) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    let buyAmount = [1, 10, 25, 100, 'max'];

    <%= upgradeFunctions %>

    /* Proceses the decay of radiactive isotopes. It uses a random draw based on the
    half life to decide how many atoms decay, and then spreads them over different
    decay forms proportionally. */
    function processDecay(player) {
      // for each radiactive isotope
      for (let i = 0; i < data.radioisotopes.length; i++) {
        let resource = data.radioisotopes[i];
        if (player.resources[resource].unlocked) {
          let number = player.resources[resource].number;
          let decay = data.resources[resource].decay;
          let halfLife = decay.half_life;
          let exponent = 1/halfLife;
          let factor = Math.pow(0.5, exponent);
          let totalProduction = Math.floor(number - number * factor);
          let remaining = totalProduction;
          // and decay products
          let highestRatio;
          for (let type of Object.values(decay.decay_types)) {
            if(!highestRatio || highestRatio.ratio < type.ratio){
              highestRatio = type;
            }
            let production = Math.floor(totalProduction * type.ratio);
            // FIXME: this is a hack to fix decay not working if the number of
            // neutrons is lower than the decay amount. Fixing starvation
            // should fix this one as well
            if (type.reaction.reactant && type.reaction.reactant.n) {
              production = Math.min(production, player.resources.n.number);
            }
            reaction.react(production, type.reaction, player);
            remaining -= production;
          }
          reaction.react(remaining, highestRatio.reaction, player);
        }
      }
    }

    /* Proceses the generation for each element. It generates isotopes with a random
    draw proportionally to their probability. */
    function processGenerators(player) {
      // we will simulate the production of isotopes proportional to their ratio
      for (let slot of player.element_slots) {
        let totalProduction = ct.elementProduction(player, slot);
        let remaining = totalProduction;
        // for each isotope
        for (let key in data.elements[slot.element].isotopes) {
          let isotope = data.elements[slot.element].isotopes[key];
          // we calculate the production proportion
          let production = Math.floor(isotope.ratio * totalProduction);

          // assign the player the produced isotope
          player.resources[key].number += production;
          if (production > 0 && !player.resources[key].unlocked) {
            player.resources[key].unlocked = true;
            state.addNew(key);
          }
          // keep track of the remaining production
          remaining -= production;
        }
        // if there is remaining production, we assign it to the main isotope
        let main = data.elements[slot.element].main;
        player.resources[main].number += remaining;
        if (remaining > 0 && !player.resources[main].unlocked) {
          player.resources[main].unlocked = true;
          state.addNew(main);
        }
      }
    }

    function update(player) {
      processDecay(player);
      processGenerators(player);
    }

    function generatorPrice(name, level) {
      return data.generators[name].price * Math.pow(data.constants.GENERATOR_PRICE_INCREASE, level);
    }

    ct.maxCanBuy = function (player, name, slot) {
      let level = slot.generators[name];
      let i = 0;
      let currency = data.elements[slot.element].main;
      let price = generatorPrice(name, level);
      // we need a loop since we use the ceil operator
      while (player.resources[currency].number >= price) {
        i++;
        price += generatorPrice(name, level + i);
      }
      return i;
    };

    ct.generatorTotalPrice = function (player, name, slot, number) {
      if (number === 'max') {
        number = ct.maxCanBuy(player, name, slot);
      }
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
        player.resources[currency].number -= price;
        slot.generators[name] += number;
      }
    };

    ct.canBuy = function (player, slot, price) {
      let currency = data.elements[slot.element].main;
      if (price > player.resources[currency].number) {
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
      for (let up of data.generators[name].upgrades) {
        if (slot.upgrades[up]) {
          let func = data.upgrades[up].function;
          production = ct[func](player, production, slot);
        }
      }
      let exotic = data.elements[slot.element].exotic;
      production *= (1 + player.resources[exotic].number * data.constants.EXOTIC_POWER) *
        (1 + player.resources.dark_matter.number * data.constants.DARK_POWER);
      return Math.floor(production);
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

    ct.nextBuyAmount = function () {
      state.buyIndex = (state.buyIndex + 1) % buyAmount.length;
    };

    ct.getbuyAmount = function () {
      return buyAmount[state.buyIndex];
    };

    state.registerUpdate('generators', update);
  }
]);
