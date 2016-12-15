angular
.module('incremental')
.service('upgrade',
['player',
function(player) {  
  var $scope;
  
  this.setScope = function (scope){
    $scope = scope;
  };

}]);