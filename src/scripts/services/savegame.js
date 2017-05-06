/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

angular
.module('incremental')
.service('savegame',
['player',
'state',
'data',
'achievement',
function(player, state, data, achievement) {
  this.save = function () {
    localStorage.setItem("playerStoredITE", JSON.stringify(player.data));
    var d = new Date();
  };

  function initSave(){
    player.data = data.start_player;
    state.init();
    achievement.init();
  }

  this.load = function () {
    try {
      var stored_player = localStorage.getItem("playerStoredITE");
      if(stored_player !== null) {
        player.data = JSON.parse(stored_player);
        this.versionControl();
      } else {
        initSave();
      }
    } catch (err) {
      alert("Error loading savegame, reset forced.");
      this.reset(false);
    }
  };

  this.reset = function (ask) {
    var confirmation = true;
    if(ask) {
      confirmation = confirm("Are you sure you want to reset? This will permanently erase your progress.");
    }

    if(confirmation === true) {
      localStorage.removeItem("playerStoredITE");
      initSave();
    }
  };

  this.exportSave = function () {
    var exportText = btoa(JSON.stringify(player.data));

    state.export = exportText;
  };

  this.importSave = function () {
    var importText = prompt("Paste the text you were given by the export save dialog here.\n" +
        "Warning: this will erase your current save!");
    if(importText) {
      try {
        player.data = JSON.parse(atob(importText));
        this.versionControl();
        this.save();
      } catch (error) {
        alert("Invalid save file.");
      }
    }
  };

  this.versionControl = function () {
    // we merge the properties of the player with the start player to
    // avoid undefined errors with new properties
    player.data = angular.merge({}, data.start_player, player.data);
  };
}]);
