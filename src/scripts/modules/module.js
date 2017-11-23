'use strict';

angular.module('game', ['ngAnimate', 'ui.router', 'rzModule'])
.filter('prettyNumber', ['numberFilter', function(numberFilter){
  return function(number, precision){
    return numberFilter(number, precision).replace(/(\.0*$)|(0*$)/, '');
  };
}]);
