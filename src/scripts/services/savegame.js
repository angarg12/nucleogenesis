/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

angular
.module('incremental')
.service('savegame',
['state',
'data',
'achievement',
function(state, data, achievement) {
  this.save = function () {
    localStorage.setItem('playerStoredITE', JSON.stringify(state.player));
  };

  function initSave(){
    state.player = data.start_player;
    state.init();
    achievement.init();
  }

  this.load = function () {
    try {
      let stored_player = localStorage.getItem('playerStoredITE');
      if(stored_player !== null) {
        state.player = JSON.parse(stored_player);
        this.versionControl();
      } else {
        initSave();
      }
    } catch (err) {
      alert('Error loading savegame, reset forced.');
      this.reset(false);
    }
  };

  this.reset = function (ask) {
    let confirmation = true;
    if(ask) {
      confirmation = confirm('Are you sure you want to reset? This will permanently erase your progress.');
    }

    if(confirmation === true) {
      localStorage.removeItem('playerStoredITE');
      initSave();
    }
  };

  this.exportSave = function () {
    let exportText = btoa(JSON.stringify(state.player));

    state.export = exportText;
  };

  this.importSave = function () {
    let importText = prompt('Paste the text you were given by the export save dialog here.\n' +
        'Warning: this will erase your current save!');
    if(importText) {
      try {
        state.player = JSON.parse(atob(importText));
        this.versionControl();
        this.save();
      } catch (error) {
        alert('Invalid save file.');
      }
    }
  };

  this.versionControl = function () {
    // we merge the properties of the player with the start player to
    // avoid undefined errors with new properties
    state.player = angular.merge({}, data.start_player, state.player);
  };
}]);
