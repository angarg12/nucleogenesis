'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'savegame',
    'achievement',
    'util',
    'format',
    'reaction',
    'data',
    'visibility',
    'state',
    function($scope, $interval, $timeout, savegame, achievement, util, format, reaction, data, visibility, state) {
      $scope.data = data;
      $scope.achievement = achievement;
      $scope.util = util;
      $scope.format = format;
      $scope.reaction = reaction;
      $scope.visibility = visibility;
      $scope.state = state;

      let self = this;
      let playerCopy = null;

      self.update = function() {
        // do the update in a copy
        playerCopy = angular.copy(state.player);
        achievement.checkAchievements(playerCopy);

        state.update(playerCopy);

        // and update all at once
        state.player = playerCopy;

        $timeout(self.update, 1000);
      };

      function save() {
        localStorage.setItem('playerStoredITE', JSON.stringify(state.player));
      }

      self.startup = function() {
        savegame.load();
        state.loading = false;
        $timeout(self.update, 1000);
        $interval(save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
