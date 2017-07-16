'use strict';

angular.module('game').component('elementSelect', {
  templateUrl: 'views/elementSelect.html',
  controller: ['state', 'visibility', 'data',
    function(state, visibility, data) {
      this.state = state;
      this.visibility = visibility;
      this.data = data;
    }
  ],
  controllerAs: 'ct'
});
