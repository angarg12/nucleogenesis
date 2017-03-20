angular
.module('incremental')
.service('savegame',
['player',
'achievement',
function(player, achievement) {
  var $scope;

  this.setScope = function (scope){
    $scope = scope;
  };

  this.save = function () {
    localStorage.setItem("playerStoredITE", JSON.stringify(player.data));
    var d = new Date();
    $scope.lastSave = d.toLocaleTimeString();
  };

  this.load = function () {
    try {
      player.data = JSON.parse(localStorage.getItem("playerStoredITE"));
      this.versionControl();
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
      $scope.init();
    }
  };

  this.exportSave = function () {
    var exportText = btoa(JSON.stringify(player.data));

    $("#exportSaveContents").toggle();
    $("#exportSaveText").val(exportText);
    $("#exportSaveText").select();
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
    player.data = angular.merge({}, player.startPlayer, player.data);
    /*
     * if(util.versionCompare(player.data.version,"0.11") == -1){
     *   init();
     * }
     */
  };
}]);
