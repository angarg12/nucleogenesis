/**
 getHtml
 Simple component to retrieve the HTML value of a resource.

 @namespace Components
 */
'use strict';

angular.module('game').component('getHtml', {
  template: '<span ng-bind-html="ct.util.trustHTML(ct.util.getHTML(ct.value))"></span>',
  controller: ['util', function(util) {
    this.util = util;
  }],
  controllerAs: 'ct',
  bindings: {
    value: '<'
  }
});
