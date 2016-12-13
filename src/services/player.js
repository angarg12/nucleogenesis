angular
.module('incremental')
.service('player',
[
function() {  
  var $scope;
  this.player;
  
  // TODO: The startPlayer object can be mostly build
  // by using the data.js structures. That would save
  // a lot of
  // redundancy and make the code more flexible and
  // dynamic.
  this.startPlayer = {
    // properties just for the sake of the intro
    // animation
    intro : {
      banner : false,
      menu : false,
      content : false
    },
    elements_unlocked : 1,
    current_theme : "base"
  };
  
  this.setScope = function (scope){
    $scope = scope;
    this.startPlayer.version = $scope.version;
  };

  this.populatePlayer = function () {
    this.startPlayer.resources = {};
    for(var entry in $scope.resources) {
      this.startPlayer.resources[entry] = {
        number : 0,
        is_new : true,
        unlocked : false
      };
    }

    this.startPlayer.elements = {};
    for(var element in $scope.elements) {
      if(!$scope.elements[element].disabled) {
        this.startPlayer.elements[element] = {
          unlocked : false
        };
      }
    }
    this.startPlayer.elements.H.unlocked = true;

    for(var element in this.startPlayer.elements) {
      this.startPlayer.elements[element].upgrades = {};
      for(var upgrade in $scope.upgrades) {
        this.startPlayer.elements[element].upgrades[upgrade] = {
          bought : false
        };
      }
      this.startPlayer.elements[element].generators = {};
      for(var generator in $scope.generators) {
        this.startPlayer.elements[element].generators[generator] = {
          level : 0
        };
      }
    }
    this.startPlayer.encyclopedia = {};
    for(var entry in $scope.encyclopedia) {
      this.startPlayer.encyclopedia[entry] = {
        is_new : true
      };
    }
    this.startPlayer.unlocks = {};
    for(var entry in $scope.unlocks) {
      this.startPlayer.unlocks[entry] = false;
    }
    this.startPlayer.synthesis = {};
    for(var entry in $scope.synthesis) {
      this.startPlayer.synthesis[entry] = {
        number : 0,
        active : 0,
        is_new : true
      };
    }

    this.startPlayer.resources.H.number = $scope.generators["Tier 1"].price;
    this.player = angular.copy(player.startPlayer);
  };

  this.save = function () {
    localStorage.setItem("playerStoredITE", JSON.stringify(this.player));
    var d = new Date();
    $scope.lastSave = d.toLocaleTimeString();
  };

  this.load = function () {
    try {
      this.player = JSON.parse(localStorage.getItem("playerStoredITE"));
    } catch (err) {
      alert("Error loading savegame, reset forced.");
      this.reset(false);
    }
    this.versionControl();
  };

  this.reset = function (ask) {
    var confirmation = true;
    if(ask) {
      confirmation = confirm("Are you sure you want to reset? This will permanently erase your progress.");
    }

    if(confirmation === true) {
      localStorage.removeItem("playerStoredITE");
      $scope.init();
      $scope.introAnimation();
    }
  };

  this.exportSave = function () {
    var exportText = btoa(JSON.stringify(this.player));

    $("#exportSaveContents").toggle();
    $("#exportSaveText").val(exportText);
    $("#exportSaveText").select();
  };

  this.importSave = function () {
    var importText = prompt("Paste the text you were given by the export save dialog here.\n" + 
        "Warning: this will erase your current save!");
    if(importText) {
      try {
        this.player = JSON.parse(atob(importText));
        achievement.stopListeners();
        this.versionControl();
        this.save();
        achievement.initializeListeners();
      } catch (error) {
        alert("Invalid save file.");
      }
    }
  };

  this.versionControl = function () {
    /*
     * if(util.versionCompare(this.player.version,"0.11") == -1){
     *   init(); 
     * }
     */
  };
}]);