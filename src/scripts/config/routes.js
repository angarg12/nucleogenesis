'use strict';

angular
  .module('game')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('matter', {
          templateUrl: 'views/matter.html'
        })
        .state('redox', {
          component: 'redox'
        })
        .state('reactor', {
          component: 'reactor'
        })
        .state('nova', {
          component: 'nova'
        })
        .state('supernova', {
          component: 'supernova'
        })
        .state('encyclopedia', {
          templateUrl: 'views/encyclopedia.html'
        })
        .state('core', {
          component: 'core'
        })
        .state('options', {
          templateUrl: 'views/options.html'
        });
    }
  ]).run([
    '$state',
    function($state) {
      $state.go('matter');
    }
  ]);
