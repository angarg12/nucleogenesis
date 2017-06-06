'use strict';

angular
  .module('game')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('matter', {
          component: 'matter'
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
          component: 'options'
        });
    }
  ]).run([
    '$state',
    function($state) {
      $state.go('matter');
    }
  ]);
