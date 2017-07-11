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
