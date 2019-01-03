/* globals confirm, atob, btoa, alert */
/**
 options
 Component that handles the options of the game.

 @namespace Components
 */
'use strict';

angular.module('game').component('options', {
  templateUrl: 'views/options.html',
  controller: ['$window', 'state', 'savegame', options],
  controllerAs: 'ct'
});

function options($window, state, savegame) {
  let ct = this;
  ct.state = state;

  ct.reset = function(ask) {
    let confirmation = true;
    if (ask) {
      confirmation = confirm('Are you sure you want to reset? This will permanently erase your progress.');
    }

    if (confirmation === true) {
      localStorage.removeItem('player');
      savegame.initSave();
    }
  };

  ct.importSave = function(player) {
    if (state.export) {
      try {
        state.player = JSON.parse(atob(state.export));
        savegame.versionControl();
      } catch (error) {
        alert('Invalid save file.');
      }
    }
  };

  ct.exportSave = function(player) {
    let exportText = btoa(JSON.stringify(player));
    let blob = new Blob([exportText], {
      type: 'text/plain'
    });
    let url = $window.URL || $window.webkitURL;
    let fileUrl = url.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = fileUrl;
    a.download = "nucleogenesis-save.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    url.revokeObjectURL(fileUrl);
  };
}
