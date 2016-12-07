angular
.module('incremental')
.service('achievement',
['$timeout',
'$rootScope',
function($timeout, $rootScope) {
  this.toast;
  this.is_toast_visible;
  var $scope;
  
  this.init = function (){
    this.toast = [];
    this.is_toast_visible = false;
  };
  
  this.setScope = function (scope){
    $scope = scope;
  };
  
  this.deleteToast = function () {
    this.toast.shift();
    if(this.toast.length > 0) {
      this.is_toast_visible = true;
    }
  };
  
  this.removeToast = function () {
    this.is_toast_visible = false;
    $timeout(this.deleteToast, 1100);
  };

  this.addToast = function (t) {
    this.toast.push(t);
    if(this.toast.length == 1) {
      this.is_toast_visible = true;
    }
  };
  
  this.numberUnlocks = function () {
    return Object.keys($scope.unlocks).length;
  };

  this.numberUnlocked = function () {
    var unlocked = 0;
    for(var key in $scope.player.unlocks) {
      if($scope.player.unlocks[key]) {
        unlocked++;
      }
    }
    return unlocked;
  };

  this.initializeListeners = function () {
    for(var key in $scope.unlocks) {
      if(!$scope.player.unlocks[key]) {
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