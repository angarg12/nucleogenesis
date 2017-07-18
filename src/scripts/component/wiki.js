/**
 sidebar
 Simple component for the Wiki tab.

 @namespace Components
 */
'use strict';

angular.module('game').component('wiki', {
  templateUrl: 'views/wiki.html',
  controller: ['visibility', 'data',
    function(visibility, data) {
      this.visibility = visibility;
      this.data = data;
    }
  ],
  controllerAs: 'ct'
});
