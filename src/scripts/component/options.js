/* globals confirm, atob, btoa, alert */
/**
 options
 Component that handles the options of the game.

 @namespace Components
 */
'use strict';

angular.module('game').component('options', {
  templateUrl: 'views/options.html',
  controller: ['$state', 'state', 'savegame', options],
  controllerAs: 'ct'
});

function options($state, state, savegame) {
  let ct = this;
  ct.state = state;

  ct.reset = function (ask) {
    let confirmation = true;
    if (ask) {
      confirmation = confirm('Are you sure you want to reset? This will permanently erase your progress.');
    }

    if (confirmation === true) {
      localStorage.removeItem('player');
      savegame.initSave();
    }
  };

  ct.importExportSave = function () {
    if (state.export) {
      try {
        state.player = JSON.parse(atob(state.export));
        savegame.versionControl();
      } catch (error) {
        alert('Invalid save file.');
      }
    } else {
      let exportText = btoa(JSON.stringify(state.player));

      state.export = exportText;
    }
  };
}
