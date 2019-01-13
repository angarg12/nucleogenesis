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

angular.module('game').controller('ct_fusion_select', ['state', 'data','$scope',
  function (state, data, $scope) {
    let ct = this;
    ct.state = state;
    ct.data = data;

    ct.availableIsotopes = function(player){
      let result = [];
      for(let resource in data.resources){
        let value = data.resources[resource];
        if(value.type.indexOf('isotope') !== -1 &&
           player.resources[resource] !== null){
             result.push(resource);
           }
      }
      return result;
    };

    ct.setPercentage = function(percentage, player) {
      let fragment = player.fusion[0][ct.source];
      fragment.number = Math.floor(player.resources[fragment.name]*(percentage/100));
      ct.fixNumber(player);
    };

    ct.fixNumber = function(player) {
      let fragment = player.fusion[0][ct.source];
      let resourceNumber = player.resources[fragment.name];
      let capacity = ct.getCapacity({resource: fragment.name, player:player});
      fragment.number = Math.max(0, Math.min(resourceNumber, fragment.number, capacity));
    };

    // we watch for changes in the area to adjust the numbers if it goes down
    ct.listener = $scope.$watch('ct.state.player.global_upgrades_current.fusion_area', function(){
      ct.fixNumber(state.player);
    });
  }
]);
