angular
.module('incremental')
.service('achievement',
['$timeout',
'$rootScope',
'player',
function($timeout, $rootScope, player) {
  self = this;
  self.toast;
  self.is_toast_visible;
  var $scope;
  
  this.init = function (){
    self.toast = [];
    self.is_toast_visible = false;
  };
  
  this.setScope = function (scope){
    $scope = scope;
  };
  
  this.deleteToast = function () {
    self.toast.shift();
    if(self.toast.length > 0) {
      self.is_toast_visible = true;
    }
  };
  
  this.removeToast = function () {
    self.is_toast_visible = false;
    $timeout(this.deleteToast, 1100);
  };

  this.addToast = function (t) {
    self.toast.push(t);
    if(this.toast.length == 1) {
      self.is_toast_visible = true;
    }
  };
  
  this.numberUnlocks = function () {
    return Object.keys($scope.unlocks).length;
  };

  this.numberUnlocked = function () {
    var unlocked = 0;
    for(var key in player.data.unlocks) {
      if(player.data.unlocks[key]) {
        unlocked++;
      }
    }
    return unlocked;
  };

  this.initializeListeners = function () {
    for(var key in $scope.unlocks) {
      if(!player.data.unlocks[key]) {
        $scope.unlocks[key].listener = $rootScope.$on($scope.unlocks[key].event, $scope.unlocks[key].check);
      }
    }
  };

  this.stopListeners = function () {
    for(var key in $scope.unlocks) {
      if($scope.unlocks[key].listener) {
        $scope.unlocks[key].listener();
        $scope.unlocks[key].listener = undefined;
      }
    }
  };
}]);