'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'savegame',
    'state',
    'data',
    'util',
    'reaction',
    function($scope, $interval, $timeout, savegame, state, data, util, reaction) {
      $scope.state = state;
      $scope.data = data;
      $scope.util = util;

      let self = this;

      self.update = function() {
        state.reactions = [];
        state.update(state.player);
        reaction.processReactions(state.reactions, state.player);
      };

      self.updateLoop = function() {
        self.update();
        let speed = 1000;
        if(state.fasterTicks){
          speed = 1;
          state.player.offline--;
          if(state.player.offline <= 0){
            state.fasterTicks = 0;
          }
        }
        $timeout(self.updateLoop, speed);
      };

      self.startup = function() {
        savegame.load();
        let elapsed = Math.floor(Date.now()/1000)-state.player.last_login;
        let total = util.calculateValue(data.global_upgrades.offline_time.power.base,
            data.global_upgrades.offline_time.power,
            state.player.global_upgrades.offline_time);
        // lets limit the offline elapsed time
        state.player.offline = Math.min(total, state.player.offline+elapsed);

        state.loading = false;
        // trigger the game loop
        $timeout(self.updateLoop, 1000);
        $interval(savegame.save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
