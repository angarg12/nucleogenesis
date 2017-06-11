'use strict';

angular.module('game').component('achievements', {
  templateUrl: 'views/achievements.html',
  controller: ['state', 'data', achievements],
  controllerAs: 'ct'
});

function achievements(state, data) {
  let ct = this;
  ct.state = state;
  ct.data = data;
}
