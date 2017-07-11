'use strict';

angular.module('game').component('reactionTable', {
  templateUrl: 'views/reactionTable.html',
  controller: ['util', 'format', 'visibility', 'data', function(util, format, visibility, data) {
    this.util = util;
    this.format = format;
    this.visibility = visibility;
    this.data = data;
  }],
  controllerAs: 'ct',
  bindings: {
    reactor: '<',
    element: '<',
    title: '<',
    player: '='
  }
});
