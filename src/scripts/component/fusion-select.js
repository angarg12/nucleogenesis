/**
 fusion
 Component that handles the fusion of isotopes to create new ones.

 @namespace Components
 */
'use strict';

angular.module('game').component('fusionSelect', {
  templateUrl: 'views/fusion-select.html',
  controller:  'ct_fusion_select',
  controllerAs: 'ct',
  bindings: {
    source: '@',
    getCapacity: '&'
  }
});

angular.module('game').controller('ct_fusion_select', ['state', 'data',
  function (state, data) {
    let ct = this;
    ct.state = state;
    ct.data = data;

    ct.availableIsotopes = function(player){
      let result = [];
      for(let resource in data.resources){
        if(data.resources[resource].type.indexOf('isotope') !== -1 &&
           player.resources[resource].unlocked){
             result.push(resource);
           }
      }
      return result;
    };

    ct.setPercentage = function(percentage, player) {
      let fragment = state.player.fusion[0][ct.source];
      fragment.number = Math.floor(player.resources[fragment.name].number*(percentage/100));
      ct.fixNumber(player);
    };

    ct.fixNumber = function(player) {
      let fragment = state.player.fusion[0][ct.source];
      let resourceNumber = player.resources[fragment.name].number;
      let capacity = ct.getCapacity({resource: fragment.name, player:player});
      fragment.number = Math.max(0, Math.min(resourceNumber, fragment.number, capacity));
    };
  }
]);
