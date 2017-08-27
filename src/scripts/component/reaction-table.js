/**
 reactionTable
 Component for the table of reactions in the Reactor tab.

 @namespace Components
 */
'use strict';

angular.module('game').component('reactionTable', {
  templateUrl: 'views/reactionTable.html',
  controller: ['$scope', 'util', 'format', 'visibility', 'data', 'state', reactionTable],
  controllerAs: 'ct',
  bindings: {
    reactor: '<',
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
      ct.reactionSelect = ct.reactor.availableReactions(ct.element)[0];
  });
}
