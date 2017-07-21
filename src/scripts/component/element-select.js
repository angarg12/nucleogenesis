/**
 elementSelect
 Simple component to display the element selection list.

 @namespace Components
 */
'use strict';

angular.module('game').component('elementSelect', {
  templateUrl: 'views/elementSelect.html',
  controller: ['state', 'visibility', 'data', elementSelect
  ],
  controllerAs: 'ct'
});

function elementSelect (state, visibility, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;

  ct.visibleElements = function() {
    return visibility.visible(data.elements, isElementVisible);
  };

  function isElementVisible(element) {
    if (data.elements[element].disabled) {
      return false;
    }

    for (let resource of data.elements[element].includes) {
      if (state.player.resources[resource].unlocked) {
        return true;
      }
    }

    return false;
  }
}
