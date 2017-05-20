'use strict';

angular.module('game').component('sidebar', {
  templateUrl: 'views/sidebar.html',
  controller: ['state', 'visibility', 'data', 'format',
    function (state, visibility, data, format) {
      this.state = state;
      this.visibility = visibility;
      this.data = data;
      this.format = format;
  }],
  controllerAs: 'ct'
});
