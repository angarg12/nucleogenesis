'use strict';

angular.module('game').component('sidebar', {
  templateUrl: 'views/sidebar.html',
  controller: ['state', 'visibility', 'data', 'format', 'util',
    function(state, visibility, data, format, util) {
      this.state = state;
      this.visibility = visibility;
      this.data = data;
      this.format = format;
      this.util = util;
    }
  ],
  controllerAs: 'ct'
});
