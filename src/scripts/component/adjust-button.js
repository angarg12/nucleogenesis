/**
 adjustButton
 Simple component to display adjust buttons for
 reactions.

 @namespace Components
 */

'use strict';

angular.module('game').component('adjustButton', {
  templateUrl: 'views/adjustButton.html',
  controllerAs: 'ct',
  bindings: {
    value: '=',
    limit: '=',
    text: '<',
    player: '=',
    syn: '='
  }
});
