'use strict';

angular
.module('game')
.config(['$stateProvider',
  function($stateProvider) {
  $stateProvider
  .state('matter', {
    templateUrl : 'views/matter.html'
  })
  .state('supernova', {
    component: 'supernova'
  })
  .state('encyclopedia', {
    templateUrl : 'views/encyclopedia.html'
  })
  .state('table', {
    templateUrl : 'views/table.html'
  })
  .state('options', {
    templateUrl : 'views/options.html'
  });
}]).run([
  '$state',
   function($state){
      $state.go('matter');
   }
]);
