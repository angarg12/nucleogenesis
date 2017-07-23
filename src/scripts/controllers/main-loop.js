'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'savegame',
    'state',
    function($scope, $interval, $timeout, savegame, state) {
      $scope.state = state;

      let self = this;
      let playerCopy = null;

      self.update = function() {
        // do the update in a copy
        playerCopy = angular.copy(state.player);

        state.update(playerCopy);

        // and update all at once
        state.player = playerCopy;

        $timeout(self.update, 1000);
      };

      self.startup = function() {
        savegame.load();
        state.loading = false;
        $timeout(self.update, 1000);
        $interval(savegame.save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
