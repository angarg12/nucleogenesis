'use strict';

angular.module('incremental').component('supernova', {
  templateUrl: 'views/supernova.html',
  controller: ['state', 'visibility', 'data','util',supernova],
  controllerAs: 'supernova'
});

function supernova(state, visibility, data, util) {
  let ctrl = this;
  ctrl.state = state;
  ctrl.visibility = visibility;
  ctrl.data = data;
  ctrl.util = util;

  ctrl.exoticProduction = function(){
    let production = 0;
    for(let resource of data.elements[state.current_element].includes){
      production += Math.floor(Math.sqrt(state.player.resources[resource].number));
    }
    return production;
  };
}
