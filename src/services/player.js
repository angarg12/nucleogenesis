angular
.module('incremental')
.service('player',
[
function() {  
  var $scope;
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
    this.data = angular.copy(this.startPlayer);
  };
}]);