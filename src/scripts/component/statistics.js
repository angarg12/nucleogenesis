/**
 getHtml
 Simple component to retrieve the HTML value of a resource.

 @namespace Components
 */
'use strict';

angular.module('game').component('statistics', {
  templateUrl: 'views/statistics.html',
  controller: ['state', statistics],
  controllerAs: 'ct'
});

function statistics( state) {
  let ct = this;
  ct.state = state;
  ct.keys = Object.keys;
}
