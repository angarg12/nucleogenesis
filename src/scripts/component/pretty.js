'use strict';

angular.module('incremental').component('pretty', {
  template: '<span ng-bind-html="ct.util.trustHTML(ct.util.prettifyNumber(ct.value))"></span>',
  controller: ['util',function (util) {
    this.util = util;
  }],
  controllerAs: 'ct',
  bindings: {
    value: '<'
  }
});
