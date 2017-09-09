/**
 supernova
 Component that handles the exotic matter and prestige logic.
 It includes exotic matter production, exotic upgrades, and infusion of
 subatomic particles to boost exotic production.
 A prestige erases the progress of a single element, and produces exotic
 matter for said element.

 @namespace Components
 */
'use strict';

angular.module('game').component('supernova', {
  templateUrl: 'views/supernova.html',
  controller: ['state', 'format', 'visibility', 'upgrade', 'data', 'util', supernova],
  controllerAs: 'ct'
});

function supernova(state, format, visibility, upgrade, data, util) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.util = util;
  ct.format = format;
  ct.infuse = {};

  /* Exotic production is a function of the different resources of each
  element. Additionally, multi-element molecules count double, once for
  each participating element. */
  ct.exoticProduction = function() {
    let production = {};
    let exotic = data.elements[state.currentElement].exotic;
    production[exotic] = 0;
    for (let resource of data.elements[state.currentElement].includes) {
      if (!state.player.resources[resource].unlocked) {
        continue;
      }
      if (data.resources[resource].type.indexOf('molecule') !== -1) {
        let multiplier = 0;
        for (let key in data.resources[resource].elements) {
          let number = data.resources[resource].elements[key];
          multiplier += number;
        }
        for (let element in data.resources[resource].elements) {
          let newExotic = data.elements[element].exotic;
          production[newExotic] = production[newExotic] || 0;
          production[newExotic] += prestigeFormula(state.player.resources[resource].number)*multiplier;
        }
      }else{
        production[exotic] += prestigeFormula(state.player.resources[resource].number);
      }
    }
    for (let key in production) {
      // we adjust the production to start at 1e6 resources
      // if (production[key] >= 13) {
      //   production[key] -= 13;
      // } else {
      //   production[key] = 0;
      // }
      // we adjust the infusion
      production[key] = Math.floor(production[key]*ct.totalInfuseBoost());
    }

    return production;
  };

  function prestigeFormula(resource){
    let stepFactor = Math.max(Math.pow(10, Math.floor(Math.log10(resource))), 1);
    let step = stepFactor/1e5;
    let sigmoidQuotient = 1+Math.pow(Math.E, -(resource/stepFactor-5.747734128));
    let sigmoid = 1/sigmoidQuotient+0.1;
    return Math.floor(step * sigmoid);
  }

  ct.exoticPrestige = function() {
    let resources = state.player.resources;
    let production = ct.exoticProduction();

    for (let key in production) {
      resources[key].number += production[key];
      resources[key].unlocked = true;
    }

    for(let resource in ct.infuse){
      state.player.resources[resource].number -= ct.infuse[resource];
    }

    upgrade.resetElement(state.player, state.currentElement);
  };

  ct.buyExoticUpgrade = function(name, element) {
    let upgrades = state.player.elements[element].exotic_upgrades;
    let price = data.exotic_upgrades[name].price;
    let currency = data.elements[element].exotic;
    upgrade.buyUpgrade(state.player,
      upgrades,
      name,
      price,
      currency);
  };

  ct.setPercentage = function(resource, percentage) {
    ct.infuse[resource] = Math.floor(state.player.resources[resource].number*(percentage/100));
  };

  ct.fixNumber = function(resource) {
    ct.infuse[resource] = Math.max(0, Math.min(state.player.resources[resource].number, ct.infuse[resource]));
  };

  /* This function checks that values inserted in the text boxes are
  valid numbers */
  ct.isValidInfusion = function() {
    let valid = true;
    for(let resource in ct.infuse){
      valid = valid && Number.isFinite(ct.infuse[resource]);
    }
    return valid;
  };

  ct.infuseBoost = function(resource) {
      let number = Math.min(ct.infuse[resource], state.player.resources[resource].number);
      if(number === 0){
        return 1;
      }
      // log adds diminishing returns to the infusion
      return 1 + Math.log(number)/Math.log(1.25)*ct.data.constants.INFUSE_POWER;
  };

  /* The infusion boosts are multiplicative with respect to each other */
  ct.totalInfuseBoost = function() {
    let total = 1;
    for(let resource in ct.infuse){
      total *= ct.infuseBoost(resource);
    }
    return total;
  };

  ct.visibleExoticUpgrades = function(currentElement) {
    return visibility.visible(data.exotic_upgrades, isExoticUpgradeVisible, currentElement);
  };

  function isExoticUpgradeVisible(name, currentElement) {
    return visibility.isUpgradeVisible(name, currentElement, data.exotic_upgrades[name]);
  }

  ct.visibleSubatomic = function() {
    return visibility.visible(data.resources, isSubatomicVisible, '');
  };

  function isSubatomicVisible(name) {
    if (!state.player.resources[name].unlocked) {
      return false;
    }

    if(data.resources[name].type &&
       data.resources[name].type.indexOf('subatomic') !== -1){
        return true;
    }

    return false;
  }
}
