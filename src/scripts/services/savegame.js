/* globals versionCompare, alert */
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
    function($state, state, data) {
      this.initSave = function() {
        state.player = {};
        this.versionControl();
        state.init();
        $state.go('generators');
      };

      this.save = function() {
        state.player.last_login = Math.floor(Date.now() / 1000);
        localStorage.setItem('player', JSON.stringify(state.player));
      };

      this.load = function() {
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

      this.versionControl = function() {
        // delete saves older than this version
        if (state.player.version && versionCompare(state.player.version, '2.6.0') < 0) {
          state.player = {};
        }
        // we merge the properties of the player with the start player to
        // avoid undefined errors with new properties
        state.player = angular.merge({}, data.start_player, state.player);

        for (let resource in state.player.resources) {
          if (!data.resources[resource]) {
            delete state.player.resources[resource];
            continue;
          }
          if (state.player.resources[resource] && typeof state.player.resources[resource].number !== 'undefined') {
            if (state.player.resources[resource].unlocked) {
              state.player.resources[resource] = state.player.resources[resource].number;
            } else {
              state.player.resources[resource] = null;
            }
          }
        }
        for (let slot of state.player.element_slots) {
          if (!slot) {
            continue;
          }
          for (let i in slot.redoxes) {
            if (slot.redoxes[i].from === -2 || slot.redoxes[i].to === -2) {
              slot.redoxes.splice(i, 1);
            }
          }
        }
      };
    }
  ]);
