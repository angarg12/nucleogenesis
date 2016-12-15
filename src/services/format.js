angular
.module('incremental')
.service('format',
['player',
function(player) {  
  var $scope;
  
  this.setScope = function (scope){
    $scope = scope;
  };

}]);