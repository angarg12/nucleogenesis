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

angular.module('game').controller('ct_fusion', ['state', 'format', 'visibility', 'data', 'util',
  function (state, format, visibility, data, util) {
    let ct = this;
    ct.state = state;
    ct.data = data;
    ct.util = util;
    ct.format = format;

    ct.getReactorArea = function(player) {
      return 1;
    };

    function getRadius(resource) {
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
      let r = getRadius(resource);
      let area = Math.PI*r*r;
      return ct.getReactorArea(player)/area;
    };

    ct.getProductIsotope = function(beam, target) {
      let beamN = parseInt(beam, 10);
      let targetN = parseInt(target, 10);

      let beamZ = getZ(beam);
      let targetZ = getZ(target);

      let productN = beamN+targetN;
      let productZ = beamZ+targetZ;

      return data.resource_matrix[productZ][productN];
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
      let beamR = getRadius(beam);

      let targetZ = getZ(target);
      let targetR = getRadius(target);

      let coulombBarrier = data.constants.COULOMB_CONSTANT*beamZ*targetZ*
              Math.pow(data.constants.ELECTRON_CHARGE, 2)/(beamR+targetR);
      return coulombBarrier * data.constants.JOULE_TO_EV;
    };

    ct.getYieldPercent = function(beam, target, player) {
      let beamR = getRadius(beam);
      let targetR = getRadius(target);
      let beamArea = Math.PI*beamR*beamR;
      let targetArea = Math.PI*targetR*targetR;

      let beamPercentArea = beamArea*ct.state.beam.number/ct.getReactorArea(player);
      let targetPercentArea = targetArea*ct.state.target.number/ct.getReactorArea(player);

      return beamPercentArea*targetPercentArea;
    };

    ct.getYield = function(beam, target, player){
      let percentYield = ct.getYieldPercent(beam, target, player);
      return Math.floor(percentYield*ct.state.target.number);
    };

    ct.getFusionReaction = function(player) {
      let reaction =  {
        reactant: {},
        product: {}
      };

      let beam = ct.state.beam.name;
      let target = ct.state.target.name;

      reaction.reactant[beam] = ct.state.beam.number;
      reaction.reactant[target] = ct.state.target.number;

      let coulombBarrier = ct.getCoulombBarrier(beam, target);
      reaction.reactant.eV = coulombBarrier*ct.state.beam.number;

      let product = ct.getProductIsotope(beam, target);
      let numberYield = ct.getYield(beam, target, player);

      reaction.product[product] = numberYield;

      let energyExchange = ct.getProductEnergy(beam, target);
      if(energyExchange < 0){
        reaction.reactant.eV += energyExchange*numberYield;
      }else if(energyExchange > 0){
        reaction.product.eV = energyExchange*numberYield;
      }

      return reaction;
    };

    function update(player){
      let source1 = '2H';
      let source2 = '2H';

      let coulombBarrier = ct.getCoulombBarrier(source1, source2);

      let quantity1 = ct.state.beam.number;
      let quantity2 = ct.state.target.number;

      let numberYield = ct.getYield(source1, source2, player);

      let totalCoulomb = coulombBarrier*quantity1;

      let product = ct.getProductIsotope(source1, source2);

      // console.log(product);
      // console.log("capacity "+capacity1);
      // console.log("coulomb "+totalCoulomb);
      // console.log("yield "+percentYield+" "+numberYield);
      if(!product) return;

      let energyExchange = ct.getProductEnergy(source1, source2);
      // console.log(energyExchange);
      if(energyExchange < 0){
        totalCoulomb += energyExchange*numberYield;
      }else{
        // console.log("produced energy "+energyExchange*numberYield);
      }
    }
  }
]);
