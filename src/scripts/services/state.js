'use strict';

angular
.module('game')
.service('state',
[function() {
    this.currentElement = 'H';
    this.hoverElement = '';
    this.export = '';
    this.player = {};

    this.init = function () {
      this.currentElement = 'H';
      this.hoverElement = '';
      this.export = '';
    };
}]);
