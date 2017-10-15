'use strict';

angular
  .module('game')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('generators', {
          component: 'generators'
        })
        .state('mechanics', {
          component: 'mechanics'
        })
        .state('redox', {
          component: 'redox'
        })
        .state('reactions', {
          component: 'reactions'
        })
        .state('fusion', {
          component: 'fusion'
        })
        .state('upgrades', {
          component: 'upgrades'
        })
        .state('exotic', {
          component: 'exotic'
        })
        .state('dark', {
          component: 'dark'
        })
        .state('elements', {
          component: 'elements'
        })
        .state('achievements', {
          component: 'achievements'
        })
        .state('dashboard', {
          component: 'dashboard'
        })
        .state('options', {
          component: 'options'
        });
    }
  ]).run([
    '$state',
    function($state) {
      $state.go('generators');
    }
  ]);
