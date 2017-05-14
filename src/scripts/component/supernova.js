'use strict';

angular.module('incremental').component('supernova', {
  templateUrl: 'views/supernova.html',
  controller: ['state', 'player','visibility', 'data','util',supernova],
  controllerAs: 'supernova'
});

function supernova(state, player, visibility, data, util) {
  let ctrl = this;
  ctrl.player = player;
  ctrl.state = state;
  ctrl.visibility = visibility;
  ctrl.data = data;
  ctrl.util = util;

  ctrl.exoticProduction = function(){
    let production = 0;
    for(let resource of data.elements[state.current_element].includes){
      production += Math.floor(Math.sqrt(player.data.resources[resource].number));
    }
    return production;
  };
}
