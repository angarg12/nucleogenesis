/**
 matter
 Component that handles generators, resource creation, isotopes and decay.

 @namespace Components
 */
'use strict';

angular.module('game').component('matter', {
  templateUrl: 'views/matter.html',
  controller: 'ct_matter',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_matter', ['state', 'visibility', 'data', 'util', 'reaction',
  function (state, visibility, data, util, reaction) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    let buyAmount = [1, 10, 25, 100, 'max'];

    /* Proceses the decay of radiactive isotopes. It uses a random draw based on the
    half life to decide how many atoms decay, and then spreads them over different
    decay forms proportionally. */
    function processDecay(player) {
      // for each radiactive isotope
      for (let i = 0; i < data.radioisotopes.length; i++) {
        let resource = data.radioisotopes[i];
        if (player.resources[resource].unlocked) {
          let element = Object.keys(data.resources[resource].elements)[0];
          let number = player.resources[resource].number;
          let decay = data.elements[element].isotopes[resource].decay;
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
      for (let element in player.elements) {
        if (!player.elements[element].unlocked) {
          continue;
        }
        let totalProduction = ct.elementProduction(player, element);
        let remaining = totalProduction;
        // for each isotope
        for (let key in data.elements[element].isotopes) {
          let isotope = data.elements[element].isotopes[key];
          // we calculate the production proportion
          let production = Math.floor(isotope.ratio * totalProduction);

          // assign the player the produced isotope
          player.resources[key].number += production;
          if (production > 0) {
            player.resources[key].unlocked = true;
            state.addNew(key);
          }
          // keep track of the remaining production
          remaining -= production;
        }
        // if there is remaining production, we assign it to the main isotope
        let main = data.elements[element].main;
        player.resources[main].number += remaining;
        if (remaining > 0) {
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

    ct.maxCanBuy = function (player, name, element) {
      let level = player.elements[element].generators[name];
      let i = 0;
      let currency = data.elements[element].main;
      let price = generatorPrice(name, level);
      // we need a loop since we use the ceil operator
      while (player.resources[currency].number >= price) {
        i++;
        price += generatorPrice(name, level + i);
      }
      return i;
    };

    ct.generatorTotalPrice = function (player, name, element, number) {
      if (number === 'max') {
        number = ct.maxCanBuy(player, name, element);
      }
      let level = player.elements[element].generators[name];
      let totalPrice = 0;
      for (let i = 0; i < number; i++) {
        let price = generatorPrice(name, level + i);
        totalPrice += Math.ceil(price);
      }
      return totalPrice;
    };

    ct.buyGenerators = function (player, name, element, number) {
      if (number === 'max') {
        number = ct.maxCanBuy(player, name, element);
      }
      let price = this.generatorTotalPrice(player, name, element, number);
      let currency = data.elements[element].main;
      if (ct.canBuy(player, element, price)) {
        player.resources[currency].number -= price;
        player.elements[element].generators[name] += number;
      }
    };

    ct.canBuy = function (player, element, price) {
      let currency = data.elements[element].main;
      if (price > player.resources[currency].number) {
        return false;
      }
      return true;
    };

    ct.generatorProduction = function (player, name, element) {
      let baseProduction = data.generators[name].power;
      return upgradedProduction(player, baseProduction, name, element);
    };

    ct.tierProduction = function (player, name, element) {
      let baseProduction = data.generators[name].power *
        player.elements[element].generators[name];
      return upgradedProduction(player, baseProduction, name, element);
    };

    /* Upgraded production includes upgrades, exotic matter and dark matter. */
    function upgradedProduction(player, production, name, element) {
      for (let up in data.generators[name].upgrades) {
        if (player.elements[element].upgrades[data.generators[name].upgrades[up]]) {
          let power = data.upgrades[data.generators[name].upgrades[up]].power;
          production = upgradeApply(production, power);
        }
      }
      let exotic = data.elements[element].exotic;
      production *= (1 + player.resources[exotic].number * data.constants.EXOTIC_POWER) *
        (1 + player.resources.dark_matter.number * data.constants.DARK_POWER);
      return Math.floor(production);
    }

    function upgradeApply(resource, power) {
      return resource * power;
    }

    ct.elementProduction = function (player, element) {
      let total = 0;
      for (let tier in data.generators) {
        total += ct.tierProduction(player, tier, element);
      }
      return total;
    };

    ct.visibleGenerators = function (currentElement) {
      return visibility.visible(data.generators, isGeneratorVisible, currentElement);
    };

    function isGeneratorVisible(name, currentElement) {
      let generator = data.generators[name];
      for (let dep of generator.deps) {
        if (state.player.elements[currentElement].generators[dep] === 0) {
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

    state.registerUpdate('matter', update);
  }
]);
