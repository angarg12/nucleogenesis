/**
 state
 This service handles all the mutable data of the game, most importantly the player data.
 It also binds together the main-loop with each component by keeping a list of update
 functions where components can register themselves.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('state', ['$timeout', function($timeout) {
    let sv = this;
    sv.currentElement = 'H';
    sv.hoverElement = '';
    sv.export = '';
    sv.player = {};
    sv.loading = true;
    sv.toast = [];
    sv.isToastVisible = false;
    let updateFunctions = {};

    sv.deleteToast = function() {
      sv.toast.shift();
      if (sv.toast.length > 0) {
        sv.isToastVisible = true;
        $timeout(sv.removeToast, 2500);
      }
    };

    sv.removeToast = function() {
      sv.isToastVisible = false;
      $timeout(sv.deleteToast, 350);
    };

    sv.addToast = function (t) {
      sv.toast.push(t);
      if (sv.toast.length === 1) {
        sv.isToastVisible = true;
        $timeout(sv.removeToast, 2500);
      }
    };

    sv.init = function() {
      sv.currentElement = 'H';
      sv.hoverElement = '';
      sv.export = '';
      sv.toast = [];
      sv.isToastVisible = false;
    };

    sv.registerUpdate = function(name, func){
      updateFunctions[name] = func;
    };

    sv.update = function(player){
      for(let func in updateFunctions){
        updateFunctions[func](player);
      }
    };
  }]);
