/**
 pretty
 Simple component to pretty print a number.

 @namespace Components
 */
'use strict';

angular.module('game').component('pretty', {
  template: '<span ng-bind-html="ct.util.trustHTML(ct.util.prettifyNumber(ct.value, ct.state.player))"></span>',
  controller: ['util', 'state', function(util, state) {
    this.util = util;
    this.state = state;
  }],
  controllerAs: 'ct',
  bindings: {
    value: '<'
  }
});
