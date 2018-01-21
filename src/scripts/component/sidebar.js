/**
 sidebar
 Simple component to display the resource sidebar.

 @namespace Components
 */
'use strict';

angular.module('game').component('sidebar', {
  templateUrl: 'views/sidebar.html',
  controller: ['state', 'visibility', 'data', 'format', 'util', sidebar],
  controllerAs: 'ct'
});

function sidebar(state, visibility, data, format, util) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.format = format;
  ct.util = util;

  // returns the elements selected plus empty string ''
  // '' represents misc resources and it is always 'active'
  ct.activeElements = function(player) {
    let result = [];
    for(let slot of player.element_slots) {
      if(slot){
        result.push(slot.element);
      }
    }
    result.push('');
    return result;
  };

  ct.visibleResources = function(element, player) {
    return visibility.visible(data.resources, isResourceVisible, element, null, player);
  };

  function isResourceVisible(name, currentElement, player) {
    if (player.resources[name] === null) {
      return false;
    }

    // This is for global resources e.g. protons, which do not
    // belong to any element
    let elements = data.resources[name].elements;
    if (Object.keys(elements).length === 0 && currentElement === '') {
      return true;
    }

    for (let element in elements) {
      if (currentElement === element &&
        (player.statistics.exotic_run[element] &&
          typeof player.statistics.exotic_run[element][name] !== 'undefined' ||
        data.elements[element].exotic === name)) {
        return true;
      }
    }

    return false;
  }
}
