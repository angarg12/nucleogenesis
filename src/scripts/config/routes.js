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
        .state('void', {
          component: 'void'
        })
        .state('core', {
          component: 'core'
        })
        .state('achievements', {
          component: 'achievements'
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
