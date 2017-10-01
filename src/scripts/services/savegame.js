/* globals versionCompare, atob, btoa */
/**
 savegame
 Service that handles save/load related functions.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('savegame', ['$state',
    'state',
    'data',
    function ($state, state, data) {
      this.initSave = function () {
        state.player = {};
        this.versionControl();
        state.init();
        $state.go('generators');
      };

      this.save = function () {
        state.player.last_login = Math.floor(Date.now()/1000);
        localStorage.setItem('player', JSON.stringify(state.player));
      };

      this.load = function () {
        try {
          let storedPlayer = localStorage.getItem('player');
          if (!storedPlayer) {
            this.initSave();
          } else {
            state.player = JSON.parse(storedPlayer);
            this.versionControl();
          }
        } catch (err) {
          alert('Error loading savegame, reset forced.');
          this.initSave();
        }
      };

      this.versionControl = function () {
        // delete saves older than this version
        if (state.player.version && versionCompare(state.player.version, '2.6.0') < 0) {
          state.player = {};
        }
        // we merge the properties of the player with the start player to
        // avoid undefined errors with new properties
        state.player = angular.merge({}, data.start_player, state.player);
      };
    }
  ]);
