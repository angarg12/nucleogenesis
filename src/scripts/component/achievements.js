'use strict';

angular.module('game').component('achievements', {
  templateUrl: 'views/achievements.html',
  controller: ['state', 'data', 'achievement', achievements],
  controllerAs: 'ct'
});

function achievements(state, data, achievement) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.achieve_service = achievement;

  ct.hasProgress = function (key) {
    return data.achievements[key].goals.length > 1 ||
      data.achievements[key].goals[0] !== 1;
  };

  ct.maxed = function (key) {
    return state.player.achievements[key] >= data.achievements[key].goals.length;
  };

  ct.inProgress = function (key) {
    return ct.state.player.achievements[key] > 0 &&
      ct.state.player.achievements[key] < data.achievements[key].goals.length;
  };

  ct.getLevel = function (key) {
    return Math.min(data.achievements[key].goals.length, state.player.achievements[key]+1);
  };

  ct.numberUnlocked = function () {
    let total = 0;
    for(let key in data.achievements){
      total += state.player.achievements[key];
    }
    return total;
  };
}
