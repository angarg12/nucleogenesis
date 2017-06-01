'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'achievement',
    'util',
    'savegame',
    'format',
    'reaction',
    'data',
    'visibility',
    'state',
    function($scope, $interval, $timeout, achievement, util, savegame, format, reaction, data, visibility, state) {
      $scope.data = data;
      $scope.achievement = achievement;
      $scope.util = util;
      $scope.savegame = savegame;
      $scope.format = format;
      $scope.reaction = reaction;
      $scope.visibility = visibility;
      $scope.state = state;
      $scope.loading = true;

      let self = this;
      let playerCopy = null;

      self.update = function() {
        // do the update in a copy
        playerCopy = angular.copy(state.player);
        achievement.checkAchievements(playerCopy);

        state.update(playerCopy);

        // and update all at once
        state.player = playerCopy;

        $timeout(self.update, 1);
      };

      self.startup = function() {
        savegame.load();
        $scope.loading = false;
        $timeout(self.update, 1000);
        $interval(savegame.save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
