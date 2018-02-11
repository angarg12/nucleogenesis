/**
 exotic
 Component that handles the exotic matter and prestige logic.
 It includes exotic matter production, exotic upgrades, and infusion of
 subatomic particles to boost exotic production.
 A prestige erases the progress of a single element, and produces exotic
 matter for said element.

 @namespace Components
 */
'use strict';

angular.module('game').component('exotic', {
  templateUrl: 'views/exotic.html',
  controller:  'ct_exotic',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_exotic', ['state', 'format', 'visibility', 'upgrade', 'data', 'util',
  function (state, format, visibility, upgradeService, data, util) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;
    ct.upgradeService = upgradeService;
    let sortFunc = upgradeService.sortFunctions(data.exotic_upgrades);
    ct.cache = {breakdown:{}};

    ct.update = function(player) {
      refresh(player);
    };

    /* Refreshes the values in the cache */
    function refresh(player){
        ct.cache.breakdown = {};
        for(let slot of player.element_slots || []){
          if(!slot){
            continue;
          }
          ct.cache.breakdown[slot.element] = ct.exoticProduction(slot.element, player);
        }
    }

    /* Exotic production is a function of the different resources of each
    element. Additionally, multi-element molecules count double, once for
    each participating element. */
    ct.exoticProduction = function(element, player) {
      let breakdown = {};
      for (let resource of data.elements[element].includes) {
        if (player.resources[resource] === null ||
            !player.statistics.exotic_run[element] ||
            typeof player.statistics.exotic_run[element][resource] === 'undefined') {
          continue;
        }
        let production = {};
        for (let elem in data.resources[resource].elements) {
          if(!player.statistics.exotic_run[elem]){
             continue;
          }
          let numberAtoms = data.resources[resource].elements[elem];
          let number = (player.statistics.exotic_run[elem][resource] || 0)*numberAtoms;
          let prod = util.prestigeProduction(number, data.constants.EXOTIC_START, data.constants.EXOTIC_STEP);

          let args = {
            production: prod,
            resource: resource
          };

          upgradeService.executeAll(data.exotic_upgrades, player.exotic_upgrades[elem], ['production', 'exotic'], args);

          // extract back the value from applying the upgrades
          let newExotic = data.elements[elem].exotic;
          production[newExotic] = (production[newExotic] || 0) + args.production;
        }
        for (let key in production) {
          // we adjust the infusion
          production[key] = Math.floor(production[key]*ct.totalInfuseBoost(player));
        }
        breakdown[resource] = production;
      }

      return breakdown;
    };

    ct.productionSum = function(element){
      let production = ct.cache.breakdown[element] || {};
      let sum = {};
	    sum[data.elements[element].exotic] = 0;
      for(let resource in production){
        for(let elem in production[resource]){
          sum[elem] = sum[elem]+production[resource][elem] || production[resource][elem];
        }
      }
      return sum;
    };

    ct.exoticPrestige = function(index, player) {
      let slot = player.element_slots[index];
      let production = ct.productionSum(slot.element);

      for (let key in production) {
        util.addResource(player, 'dark', key, production[key], state);
      }

      upgradeService.resetElement(player, slot.element);

      // we deactivate reactions and redoxes
      for (let reaction of slot.reactions) {
        reaction.active = false;
      }

      for (let redox of slot.redoxes) {
        redox.active = false;
      }

      // we cache them in case players want to pick up the same element
      // the cache only lasts the current session
      state.reactionsCache[slot.element] = slot.reactions;
      state.redoxesCache[slot.element] = slot.redoxes;

      player.element_slots[index] = null;
      player.statistics.exotic_run[slot.element] = {};
    };

    ct.buyExoticUpgrade = function(name, slot, player) {
      let price = data.exotic_upgrades[name].price;
      let currency = data.elements[slot.element].exotic;
      upgradeService.buyUpgrade(player,
        player.exotic_upgrades[slot.element],
        data.exotic_upgrades[name],
        name,
        price,
        currency);
    };

    ct.infuseBoost = function(resource, player) {
        let number = player.resources[resource];
        if(number === 0){
          return 1;
        }
        // log adds diminishing returns to the infusion
        return 1 + Math.log(number)/Math.log(1.25)*ct.data.constants.INFUSE_POWER;
    };

    /* The infusion boosts are multiplicative with respect to each other */
    ct.totalInfuseBoost = function(player) {
      let total = 1;
      for(let resource of ct.visibleSubatomic(player)){
        total *= ct.infuseBoost(resource, player);
      }
      return total;
    };

    ct.visibleExoticUpgrades = function(slot, player) {
      return visibility.visible(data.exotic_upgrades, isExoticUpgradeVisible, slot, sortFunc[player.options.sortIndex], player);
    };

    function isExoticUpgradeVisible(name, slot, player) {
      return visibility.isUpgradeVisible(name, slot, data.exotic_upgrades[name], player) &&
          (!player.options.hideBought || !player.exotic_upgrades[slot.element][name]);
    }

    ct.visibleSubatomic = function(player) {
      return visibility.visible(data.resources, isSubatomicVisible, '', null, player);
    };

    function isSubatomicVisible(name, _, player) {
      if (player.resources[name] === null) {
        return false;
      }

      if(data.resources[name].type &&
         data.resources[name].type.indexOf('subatomic') !== -1){
          return true;
      }

      return false;
    }

    if(!state.noload){
      state.registerUpdate('exotic', ct.update);
  	  refresh(state.player);
    }
  }
]);
