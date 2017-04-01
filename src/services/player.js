angular
.module('incremental')
.service('player',
['data',
function(data) {
  this.data;

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

  this.populatePlayer = function () {
    this.startPlayer.version = data.version;
    this.startPlayer.resources = {};
    for(var entry in data.resources) {
      this.startPlayer.resources[entry] = {
        number : 0,
        is_new : true,
        unlocked : false
      };
    }

    this.startPlayer.elements = {};
    for(var element in data.elements) {
      if(!data.elements[element].disabled) {
        this.startPlayer.elements[element] = {
          unlocked : false
        };
      }
    }

    for(var element in this.startPlayer.elements) {
      this.startPlayer.elements[element].upgrades = {};
      for(var upgrade in data.upgrades) {
        this.startPlayer.elements[element].upgrades[upgrade] = {
          bought : false
        };
      }
      this.startPlayer.elements[element].generators = {};
      for(var generator in data.generators) {
        this.startPlayer.elements[element].generators[generator] = {
          level : 0
        };
      }
    }
    this.startPlayer.encyclopedia = {};
    for(var entry in data.encyclopedia) {
      this.startPlayer.encyclopedia[entry] = {
        is_new : true
      };
    }
    this.startPlayer.unlocks = {};
    for(var entry in data.unlocks) {
      this.startPlayer.unlocks[entry] = false;
    }
    this.startPlayer.syntheses = {};
    for(var entry in data.syntheses) {
      this.startPlayer.syntheses[entry] = {
        number : 0,
        active : 0,
        is_new : true
      };
    }

    this.startPlayer.elements.H.unlocked = true;
    this.startPlayer.resources.H.unlocked = true;
    this.startPlayer.resources.H.number = data.generators["Tier 1"].price;
  };

  this.initialisePlayer = function () {
    this.data = angular.copy(this.startPlayer);
  };
}]);
