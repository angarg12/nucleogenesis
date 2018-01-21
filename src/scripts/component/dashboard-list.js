/**
 getHtml
 Simple component to retrieve the HTML value of a resource.

 @namespace Components
 */
'use strict';

angular.module('game').component('dashboardList', {
  templateUrl: 'views/dashboard-list.html',
  controller: ['data','state','util','visibility', dashboardList],
  controllerAs: 'ct'
});

function dashboardList(data, state, util, visibility) {
  let ct = this;
  ct.data = data;
  ct.state = state;
  ct.util = util;
  ct.searchText = '';

  ct.resourcesForElement = function(element, player) {
    return visibility.visible(data.resources, filter, element, null, player);
  };

  function filter(name, currentElement, player) {
    if(player.resources[name] === null){
      return false;
    }
    if(ct.searchText && name.toLowerCase().indexOf(ct.searchText.toLowerCase()) === -1){
      return false;
    }
    // This is for global resources e.g. protons, which do not
    // belong to any element
    let elements = data.resources[name].elements;
    if (Object.keys(elements).length === 0 && currentElement === '') {
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
