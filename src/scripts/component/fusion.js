/**
 fusion
 Component that handles the fusion of isotopes to create new ones.

 @namespace Components
 */
'use strict';

angular.module('game').component('fusion', {
  templateUrl: 'views/fusion.html',
  controller:  'ct_fusion',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_fusion', ['state', 'format', 'visibility', 'data', 'util', 'reaction', 'upgrade',
  function (state, format, visibility, data, util, reactionService, upgradeService) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;
    ct.upgradeService = upgradeService;
    ct.adjustAmount = [1, 10, 25, 100];

    function getFermiRadius(resource) {
      let isotope = data.resources[resource];
      let A = isotope.energy/data.constants.U_TO_EV;
      return data.constants.FERMI_RADIUS * Math.pow(A, 0.3333);
    }

    function getZ(resource){
      let isotope = data.resources[resource];
      let element = Object.keys(isotope.elements)[0];
      return data.elements[element].number;
    }

    ct.getCapacity = function(resource, player) {
      let isotope = data.resources[resource];
      let element = Object.keys(isotope.elements)[0];
      let r = data.elements[element].van_der_waals;
      let area = Math.PI*r*r;
      return util.calculateValue(data.global_upgrades.fusion_area.power.base,
            data.global_upgrades.fusion_area.power,
            player.global_upgrades_current.fusion_area)/area;
    };

    ct.getTime = function(player) {
      let time = ct.getFusionReaction(player).reactant.eV/util.calculateValue(data.global_upgrades.fusion_bandwidth.power.base,
            data.global_upgrades.fusion_bandwidth.power,
            player.global_upgrades.fusion_bandwidth);
      time = Math.floor(time);
      return Math.max(1, time);
    };

    ct.getProductIsotope = function(beam, target) {
      let beamN = parseInt(beam, 10);
      let targetN = parseInt(target, 10);

      let beamZ = getZ(beam);
      let targetZ = getZ(target);

      let productN = beamN+targetN;
      let productZ = beamZ+targetZ;

      if(data.resource_matrix[productZ]){
        return data.resource_matrix[productZ][productN];
      }
      return null;
    };

    ct.getProductEnergy = function(beam, target) {
      let product = ct.getProductIsotope(beam, target);
      if(!product){
        return 0;
      }
      let beamBE = data.resources[beam].binding_energy;
      let targetBE = data.resources[target].binding_energy;
      let productBE = data.resources[product].binding_energy;

      return productBE - (beamBE + targetBE);
    };

    ct.getCoulombBarrier = function(beam, target) {
      let beamZ = getZ(beam);
      let beamR = getFermiRadius(beam);

      let targetZ = getZ(target);
      let targetR = getFermiRadius(target);

      let coulombBarrier = data.constants.COULOMB_CONSTANT*beamZ*targetZ*
              Math.pow(data.constants.ELECTRON_CHARGE, 2)/(beamR+targetR);
      return coulombBarrier * data.constants.JOULE_TO_EV;
    };

    ct.getYieldPercent = function(player) {
      let beam = player.fusion[0].beam;
      let target = player.fusion[0].target;
      let beamR = getFermiRadius(beam.name);
      let targetR = getFermiRadius(target.name);
      let beamArea = Math.PI*beamR*beamR;
      let targetArea = Math.PI*targetR*targetR;

      let reactorArea = util.calculateValue(data.global_upgrades.fusion_area.power.base,
            data.global_upgrades.fusion_area.power,
            player.global_upgrades_current.fusion_area);
      let beamPercentArea = beamArea*beam.number/reactorArea;
      let targetPercentArea = targetArea*target.number/reactorArea;

      return beamPercentArea*targetPercentArea;
    };

    ct.getYield = function(player){
      let percentYield = ct.getYieldPercent(player);
      let target = player.fusion[0].target.number;
      let beam = player.fusion[0].beam.number;
      // the yield comes from wherever source is more abundant
      let impacted = Math.max(target, beam);
      return Math.floor(percentYield*impacted);
    };

    ct.getFusionReaction = function(player) {
      let reaction = {
        reactant: {},
        product: {}
      };

      let beam = player.fusion[0].beam;
      let target = player.fusion[0].target;

      reaction.reactant[beam.name] = beam.number;
      reaction.reactant[target.name] = target.number;

      let coulombBarrier = ct.getCoulombBarrier(beam.name, target.name);
      reaction.reactant.eV = coulombBarrier*beam.number;

      let product = ct.getProductIsotope(beam.name, target.name);
      let numberYield = ct.getYield(player);

      reaction.product[product] = numberYield;

      // return the leftovers from the reaction
      if(numberYield < beam.number){
        reaction.product[beam.name] = beam.number - numberYield;
      }
      if(numberYield < target.number){
        reaction.product[target.name] = target.number - numberYield;
      }

      let energyExchange = ct.getProductEnergy(beam.name, target.name);
      if(energyExchange < 0){
        reaction.reactant.eV += energyExchange*numberYield;
      }else if(energyExchange > 0){
        reaction.product.eV = energyExchange*numberYield;
      }

      return reaction;
    };

    function activateFusion(player){
      let beam = player.fusion[0].beam;
      let target = player.fusion[0].target;

      if(player.resources[beam.name] < beam.number ||
        player.resources[target.name] < target.number){
        player.fusion[0].running = false;
        return;
      }
      player.resources[beam.name] -= beam.number;
      player.resources[target.name] -= target.number;

      player.fusion[0].running = true;
    }

    ct.stopFusion = function(player, fusion) {
      if(fusion.running){
        let beam = player.fusion[0].beam;
        let target = player.fusion[0].target;

        player.resources[beam.name] += fusion.beam.number;
        player.resources[target.name] += fusion.target.number;
      }

      fusion.eV = 0;
      fusion.active = false;
      fusion.running = false;
      fusion.run = false;
    };

    function updateFusion(player, fusion) {
        let bandwidth = util.calculateValue(data.global_upgrades.fusion_bandwidth.power.base,
            data.global_upgrades.fusion_bandwidth.power,
            player.global_upgrades.fusion_bandwidth);
        let spent = Math.min(player.resources.eV, bandwidth);
        fusion.eV += spent;
        player.resources.eV -= spent;
    }

    function endFusion(player, fusion, reaction) {
      // energy is not lost! if there are leftovers, give them back to the player
      let leftover = fusion.eV - reaction.reactant.eV;
      reaction.product.eV = reaction.product.eV + leftover || leftover;
      // Reaction checks that the player has the quantity necessary
      // to react, but here eV is stored in the fusion object. By setting the cost to 0
      // we make sure that it always work
      reaction.reactant = {eV:0};
      // To avoid double counting of resources in stats, we need to manually add resources
      // to the player
      let beam = fusion.beam.name;
      let target = fusion.target.name;

      player.resources[beam] += reaction.product[beam];
      player.resources[target] += reaction.product[target];
      reaction.product[beam] = 0;
      reaction.product[target] = 0;

      state.reactions.push({number: 1, reaction:reaction});

      fusion.eV = 0;
      player.fusion[0].running = false;
    }

    function update(player){
      for(let fusion of player.fusion){
        if(!fusion.active){
          continue;
        }
        if(fusion.eV === 0 && fusion.run){
          activateFusion(player);
        }
        if(!fusion.running){
          continue;
        }
        updateFusion(player, fusion);
        let reaction = ct.getFusionReaction(player);
        if(fusion.eV >= reaction.reactant.eV){
          endFusion(player, fusion, reaction);
        }
      }
    }

    ct.adjustLevel = function(player, upgrade, amount){
      player.global_upgrades_current[upgrade] += amount;
      // We cap it between 1 and the current max level
      player.global_upgrades_current[upgrade] = Math.max(1, Math.min(player.global_upgrades_current[upgrade], player.global_upgrades[upgrade]));
    };

    ct.visibleUpgrades = function() {
      return visibility.visible(data.global_upgrades, upgradeService.filterByTag('fusion'));
    };

    state.registerUpdate('fusion', update);
  }
]);
