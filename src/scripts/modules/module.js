'use strict';

angular.module('game', ['ngAnimate', 'ui.router'])
.filter('keylength', function(){
  return function(input){
    if(!angular.isObject(input)){
      throw Error('Usage of non-objects with keylength filter!!');
    }
    return Object.keys(input).length;
  };
})
.filter('prettyNumber', ['numberFilter', function(numberFilter){
  return function(number, precision){
    return numberFilter(number, precision).replace(/(\.0*$)|(0*$)/, '');
  };
}]);
