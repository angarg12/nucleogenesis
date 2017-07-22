/**
 reactionTable
 Component for the table of reactions in the Reactor tab.

 @namespace Components
 */
'use strict';

angular.module('game').component('reactionTable', {
  templateUrl: 'views/reactionTable.html',
  controller: ['util', 'format', 'visibility', 'data', 'state', reactionTable],
  controllerAs: 'ct',
  bindings: {
    reactor: '<',
    element: '<',
    title: '<'
  }
});

function reactionTable(util, format, visibility, data, state) {
  let ct = this;
  ct.util = util;
  ct.format = format;
  ct.data = data;
  ct.state = state;

  ct.visibleSyntheses = function(currentElement) {
    return visibility.visible(data.reactions, isSynthesisVisible, currentElement);
  };

  function isSynthesisVisible(key, currentElement) {
    let entry = data.reactions[key];
    for (let reactant in entry.reactant) {
      if (!state.player.resources[reactant].unlocked) {
        return false;
      }
    }

    // for misc reactions
    if(entry.elements.length === 0 &&
       currentElement === ''){
         return true;
    }

    for (let element in entry.elements) {
      if (currentElement === entry.elements[element]) {
        return true;
      }
    }

    return false;
  }
}
