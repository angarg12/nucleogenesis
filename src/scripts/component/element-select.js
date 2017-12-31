/**
 elementSelect
 Simple component to display the element selection list.

 @namespace Components
 */
'use strict';

angular.module('game').component('elementSelect', {
  templateUrl: 'views/element-select.html',
  controller: 'ct_element_select',
  controllerAs: 'ct',
  bindings: {
    index: '<'
  }
});

angular.module('game').controller('ct_element_select', ['state', 'visibility', 'data',
function (state, visibility, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;

  ct.selectElement = function(element, index, player) {
    let slot = {};
    for(let key in data.element_slot){
      slot[key] = angular.copy(data.element_slot[key]);
    }
    let first = Object.keys(data.generators)[0];
    slot.generators[first] = 1;
    slot.element = element;
    player.element_slots[index] = slot;

    let cachedReactions = state.reactionsCache[slot.element];
    if(cachedReactions){
      slot.reactions = cachedReactions;
    }
    let cachedRedoxes = state.redoxesCache[slot.element];
    if(cachedRedoxes){
      slot.redoxes = cachedRedoxes;
    }
  };

  ct.isElementSelected = function(name, player) {
    for(let slot of player.element_slots){
      if(slot && slot.element === name){
        return true;
      }
    }
    return false;
  };

  ct.visibleElements = function(player) {
    return visibility.visible(data.elements, isElementVisible, null, null, player);
  };

  function isElementVisible(element, _, player) {
    return player.elements[element];
  }
}
]);
