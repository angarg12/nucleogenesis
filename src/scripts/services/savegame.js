/* globals versionCompare, atob, btoa */
'use strict';

angular
  .module('game')
  .service('savegame', ['$state',
    'state',
    'data',
    'achievement',
    function ($state, state, data, achievement) {
      this.initSave = function () {
        state.player = {};
        versionControl();
        achievement.init();
        state.init();
        $state.go('matter');
      };

      this.load = function () {
        try {
          let storedPlayer = localStorage.getItem('playerStoredITE');
          // versionControl will catch an invalid player
          state.player = JSON.parse(storedPlayer);
          versionControl();
        } catch (err) {
          alert('Error loading savegame, reset forced.');
          this.initSave();
        }
      };

      function versionControl() {
        // delete saves older than this version
        if (state.player.version && versionCompare(state.player.version, '2.1.0') < 0) {
          state.player = {};
        }
        // we merge the properties of the player with the start player to
        // avoid undefined errors with new properties
        state.player = angular.merge({}, data.start_player, state.player);
        // append an id if it doesn't exist
        if (!state.player.id) {
          state.player.id = Math.random().toString().substring(3);
        }
      }
    }
  ]);
