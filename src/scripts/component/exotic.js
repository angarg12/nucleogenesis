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
  function (state, format, visibility, upgrade, data, util) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;
    ct.infuse = {};
    let sortFunc = [
      (a,b) => data.exotic_upgrades[a].name < data.exotic_upgrades[b].name ? -1 : 1,
      (a,b) => data.exotic_upgrades[a].price - data.exotic_upgrades[b].price
    ];
    ct.cache = {breakdown:{}};

    ct.update = function(player) {
      refresh(player);
    }

    /* Refreshes the values in the cache */
    function refresh(player){
        ct.cache.breakdown = {};
        for(let slot of player.element_slots || []){
          if(!slot){
            continue;
          }
          ct.cache.breakdown[slot.element] = ct.exoticProduction(slot.element);
        }
    }

    /* Exotic production is a function of the different resources of each
    element. Additionally, multi-element molecules count double, once for
    each participating element. */
    ct.exoticProduction = function(element) {
      let breakdown = {};
      for (let resource of data.elements[element].includes) {
        if (!state.player.resources[resource].unlocked ||
            !state.player.statistics.exotic_run[element] ||
            typeof state.player.statistics.exotic_run[element][resource] === 'undefined') {
          continue;
        }
        let production = {};
        for (let elem in data.resources[resource].elements) {
          if(!state.player.statistics.exotic_run[elem]){
             continue;
          }
          let numberAtoms = data.resources[resource].elements[elem];
          let prod = prestigeFormula((state.player.statistics.exotic_run[elem][resource] || 0)*numberAtoms);

          let args = {
            production: prod,
            resource: resource
          };

          upgrade.executeAll(data.exotic_upgrades, state.player.exotic_upgrades[elem], ['production', 'exotic'], args);

          // extract back the value from applying the upgrades
          let newExotic = data.elements[elem].exotic;
          production[newExotic] = (production[newExotic] || 0) + args.production;
        }
        for (let key in production) {
          // we adjust the infusion
          production[key] = Math.floor(production[key]*ct.totalInfuseBoost());
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

    function prestigeFormula(resource){
      resource = resource || 0;
      let production = Math.pow(Math.E,(-0.5+Math.sqrt(0.25+0.8686*Math.log(resource/1e6)))/0.4343) || 0;
      return Math.round(Math.max(0, production));
    }

    ct.exoticPrestige = function(index) {
      let slot = state.player.element_slots[index];
      let production = ct.productionSum(slot.element);

      for (let key in production) {
        util.addResource(state.player, 'dark', key, production[key]);
      }

      for(let resource in ct.infuse){
        state.player.resources[resource].number = Math.max(0, state.player.resources[resource].number-ct.infuse[resource]);
      }

      upgrade.resetElement(state.player, slot.element);

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

      state.player.element_slots[index] = null;
      state.player.statistics.exotic_run[slot.element] = {};
    };

    ct.buyExoticUpgrade = function(name, slot) {
      let price = data.exotic_upgrades[name].price;
      let currency = data.elements[slot.element].exotic;
      upgrade.buyUpgrade(state.player,
        state.player.exotic_upgrades[slot.element],
        data.exotic_upgrades[name],
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

    ct.visibleExoticUpgrades = function(slot) {
      return visibility.visible(data.exotic_upgrades, isExoticUpgradeVisible, slot, sortFunc[state.sort]);
    };

    function isExoticUpgradeVisible(name, slot) {
      return visibility.isUpgradeVisible(name, slot, data.exotic_upgrades[name]) && (!state.hideBought || !state.player.exotic_upgrades[slot.element][name]);
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

    state.registerUpdate('exotic', ct.update);
	  refresh(state.player);
  }
]);
