/**
 reactionTable
 Component for the table of reactions in the reactions tab.

 @namespace Components
 */
'use strict';

angular.module('game').component('reactionTable', {
  templateUrl: 'views/reactionTable.html',
  controller: ['$scope', 'util', 'format', 'visibility', 'data', 'state', reactionTable],
  controllerAs: 'ct',
  bindings: {
    reactions: '<',
    element: '<',
    title: '<'
  }
});

function reactionTable($scope, util, format, visibility, data, state) {
  let ct = this;
  ct.util = util;
  ct.format = format;
  ct.data = data;
  ct.state = state;

  $scope.$watch('ct.element', function() {
      ct.reactionSelect = ct.reactions.availableReactions(ct.element)[0];
  });
}
