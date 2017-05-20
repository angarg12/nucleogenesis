/* globals versionCompare, atob, btoa */
'use strict';

angular
.module('game')
.service('savegame',
['$state',
'state',
'data',
'achievement',
function($state, state, data, achievement) {
  this.save = function () {
    localStorage.setItem('playerStoredITE', JSON.stringify(state.player));
  };

  function initSave(){
    state.player = {};
    versionControl();
    // runLoop is set to true here
    achievement.init();
    state.init();
    $state.go('matter');
  }

  this.load = function () {
    try {
      let storedPlayer = localStorage.getItem('playerStoredITE');
      if(storedPlayer !== null) {
        state.player = JSON.parse(storedPlayer);
        versionControl();
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
        versionControl();
        this.save();
      } catch (error) {
        alert('Invalid save file.');
      }
    }
  };

   function versionControl() {
    // delete saves older than this version
    if(state.player.version && versionCompare(state.player.version, '2.1.0') < 0){
      state.player = {};
    }
    // we merge the properties of the player with the start player to
    // avoid undefined errors with new properties
    state.player = angular.merge({}, data.start_player, state.player);
    // append an id if it doesn't exist
    if(!state.player.id){
      state.player.id = Math.random().toString().substring(3);
    }
  }
}]);
