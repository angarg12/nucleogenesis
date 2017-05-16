'use strict';

angular
.module('incremental')
.service('state',
[function() {
    this.current_element = 'H';
    this.hover_element = '';
    this.export = '';
    this.player = {};

    this.init = function () {
      this.current_element = 'H';
      this.hover_element = '';
      this.export = '';
    };
}]);
