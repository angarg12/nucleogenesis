'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'savegame',
    'state',
    function($scope, $interval, $timeout, savegame, state) {
      $scope.state = state;

      let self = this;
      let playerCopy = null;

      /**
       * Polyfill for Object.values from the TS39 Proposal. Reflect.ownKeys
       * swapped out for an equivalent using Object instead. Placing it here so
       * it'll fire before it's needed in ct_matter, and at the top of this
       * controller so it'll only fire once.
       *
       * Polyfill: https://github.com/tc39/proposal-object-values-entries
       * Reflect.ownKeys Alternative:
       * https://stackoverflow.com/questions/34449045/what-is-the-difference-between-reflect-ownkeysobj-and-object-keysobj
       */
      const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
      const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
      const concat = Function.bind.call(Function.call, Array.prototype.concat);
      const keys = (target) => Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      // const keys = Reflect.ownKeys;

      if (!Object.values) {
        Object.values = function values(O) {
          return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
        };
      }

      if (!Object.entries) {
        Object.entries = function entries(O) {
          return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []), []);
        };
      }
      /** End Polyfill */

      self.update = function() {
        // do the update in a copy
        playerCopy = angular.copy(state.player);

        state.update(playerCopy);

        // and update all at once
        state.player = playerCopy;

        $timeout(self.update, 1000);
      };

      self.startup = function() {
        savegame.load();
        state.loading = false;
        $timeout(self.update, 1000);
        $interval(savegame.save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
