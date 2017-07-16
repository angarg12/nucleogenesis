'use strict';

angular.module('game').component('supernova', {
  templateUrl: 'views/supernova.html',
  controller: ['state', 'format', 'visibility', 'upgrade', 'data', 'util', supernova],
  controllerAs: 'ct'
});

function supernova(state, format, visibility, upgrade, data, util) {
  let ct = this;
  ct.state = state;
  ct.visibility = visibility;
  ct.data = data;
  ct.util = util;
  ct.format = format;
  ct.infuse = {};

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
          production[newExotic] += Math.floor(Math.max(0, Math.log(state.player.resources[resource].number))) * multiplier;
        }
      }else{
        production[exotic] += Math.floor(Math.max(0, Math.log(state.player.resources[resource].number)));
      }
    }
    for (let key in production) {
      // we adjust the production to start at 1e6 resources
      if (production[key] >= 13) {
        production[key] -= 13;
      } else {
        production[key] = 0;
      }
      // we adjust the infusion
      production[key] += Math.floor(production[key]*ct.totalInfuseBoost());
    }

    return production;
  };

  ct.exoticPrestige = function() {
    let resources = state.player.resources;
    let production = ct.exoticProduction();

    for (let key in production) {
      resources[key].number += production[key];
      resources[key].unlocked = true;
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
  }

  ct.fixNumber = function(resource) {
    ct.infuse[resource] = Math.max(0, Math.min(state.player.resources[resource].number, ct.infuse[resource]));
  }

  ct.isValidInfusion = function() {
    let valid = true;
    for(let resource in ct.infuse){
      console.log(resource+" "+ct.infuse[resource]+" "+Number.isFinite(ct.infuse[resource]));
      valid = valid && Number.isFinite(ct.infuse[resource]);
    }
    return valid;
  }

  ct.totalInfuseBoost = function() {
    let total = 1;
    for(let resource in ct.infuse){
      let number = Math.min(ct.infuse[resource], state.player.resources[resource].number);
      total *= 1+number*ct.data.constants.INFUSE_POWER;
    }
    return total-1;
  }
}
