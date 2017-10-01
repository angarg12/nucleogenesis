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
  .service('state', ['$timeout',
    'data',
  function($timeout, data) {
    let sv = this;
    sv.hoverElement = '';
    sv.export = '';
    sv.player = {};
    sv.loading = true;
    sv.processingOffline = false;
    sv.offlineCyclesTotal = 0;
    sv.offlineCyclesCurrent = 0;
    sv.cancelOffline = false;
    sv.toast = [];
    sv.isToastVisible = false;
    sv.buyIndex = 0;
    let newElements = [];
    let updateFunctions = {};
    sv.hideBought = false;
    sv.reactionsCache = {};
    sv.redoxesCache = {};

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
      sv.hoverElement = '';
      sv.export = '';
      sv.toast = [];
      sv.isToastVisible = false;
      newElements = [];
    };

    sv.hasNew = function(entry) {
      return newElements.indexOf(entry) !== -1;
    };

    sv.addNew = function(entry) {
      newElements.push(entry);
    };

    sv.removeNew = function(entry) {
      if (newElements.indexOf(entry) !== -1) {
        newElements.splice(newElements.indexOf(entry), 1);
      }
    };

    sv.elementHasNew = function(element) {
      let includes = data.elements[element].includes;
      for (let key in includes) {
        if (sv.hasNew(includes[key])) {
          return true;
        }
      }
      return false;
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
