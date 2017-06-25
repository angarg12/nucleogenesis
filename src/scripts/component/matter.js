'use strict';

angular.module('game').component('matter', {
  templateUrl: 'views/matter.html',
  controller: 'ct_matter',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_matter', ['state', 'visibility', 'data', 'util',
function (state, visibility, data, util) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;

  function processDecay(player) {
    for (let i = 0; i < data.radioisotopes.length; i++) {
      let resource = data.radioisotopes[i];
      if (player.resources[resource].unlocked) {
        let number = player.resources[resource].number;
        let halfLife = data.resources[resource].decay.half_life;
        let production = util.randomDraw(number, Math.log(2) / halfLife);

        if (production === 0) {
          continue;
        }

        // we decrease the number of radioactive element
        player.resources[resource].number -= production;

        // and decay products
        for (let product in data.resources[resource].decay.decay_product) {
          player.resources[product].number += data.resources[resource].decay.decay_product[product] *
            production;
          if (!player.resources[product].unlocked) {
            player.resources[product].unlocked = true;
            visibility.addNew(product);
          }
        }
      }
    }
  }

  function processGenerators(player) {
    // We will simulate the production of isotopes proportional to their ratio
    for (let element in player.elements) {
      if (player.elements[element].unlocked === false) {
        continue;
      }
      // Prepare an array with the isotopes
      let isotopes = Object.keys(data.elements[element].isotopes);
      let remaining = ct.elementProduction(element);
      // We will create a random draw recalculate the mean and std
      for (let i = 0; i < isotopes.length - 1; i++) {
        // First we need to adjust the ratio for the remaining isotopes
        let remainingRatioSum = 0;
        for (let j = i; j < isotopes.length; j++) {
          remainingRatioSum += data.resources[isotopes[j]].ratio;
        }

        let p = data.resources[isotopes[i]].ratio / remainingRatioSum;
        let production = util.randomDraw(remaining, p);

        if (production > 0) {
          player.resources[isotopes[i]].number += production;
          if (!player.resources[isotopes[i]].unlocked) {
            player.resources[isotopes[i]].unlocked = true;
            visibility.addNew(isotopes[i]);
          }
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if (remaining > 0) {
        let last = isotopes[isotopes.length - 1];
        player.resources[last].number += remaining;
        if (!player.resources[last].unlocked) {
          player.resources[last].unlocked = true;
          visibility.addNew(last);
        }
      }
    }
  }

function update(player){
  processDecay(player);
  processGenerators(player);
}

  ct.generatorPrice = function(name, element) {
    let level = state.player.elements[element].generators[name];
    let price = data.generators[name].price * Math.pow(data.generators[name].priceIncrease, level);
    return Math.ceil(price);
  };

  ct.buyGenerators = function(name, element, number) {
    let price = this.generatorPrice(name, element);
    let i = 0;
    // we need a loop since we use the ceil operator
    let currency = data.elements[element].main;
    while (i < number && state.player.resources[currency].number >= price) {
      state.player.resources[currency].number -= price;
      state.player.elements[element].generators[name]++;
      price = this.generatorPrice(name, element);
      i++;
    }
  };

  ct.generatorProduction = function(name, element) {
    let baseProduction = data.generators[name].power;
    return upgradedProduction(baseProduction, name, element);
  };

  ct.tierProduction = function(name, element) {
    let baseProduction = data.generators[name].power *
      state.player.elements[element].generators[name];
    return upgradedProduction(baseProduction, name, element);
  };

  function upgradedProduction(production, name, element) {
    for (let up in data.generators[name].upgrades) {
      if (state.player.elements[element].upgrades[data.generators[name].upgrades[up]]) {
        let power = data.upgrades[data.generators[name].upgrades[up]].power;
        production = upgradeApply(production, power);
      }
    }
    let exotic = data.elements[element].exotic;
    production += production * state.player.resources[exotic].number * data.constants.EXOTIC_POWER;
    return Math.floor(production);
  }

  function upgradeApply(resource, power) {
    return resource * power;
  }

  ct.elementProduction = function(element) {
    let total = 0;
    for (let tier in data.generators) {
      total += ct.tierProduction(tier, element);
    }
    return total;
  };

  state.registerUpdate('matter', update);
}]);
