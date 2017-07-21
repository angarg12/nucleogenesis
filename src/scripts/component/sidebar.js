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

  ct.visibleResources = function(currentElement) {
    return visibility.visible(data.resources, isResourceVisible, currentElement);
  };

  function isResourceVisible(name, currentElement) {
    if (!state.player.resources[name].unlocked) {
      return false;
    }

    // This is for global resources e.g. protons, which do not
    // belong to any element
    let elements = data.resources[name].elements;
    if (Object.keys(elements).length === 0) {
      return true;
    }

    for (let element in elements) {
      if (currentElement === element) {
        return true;
      }
    }

    return false;
  }
}
