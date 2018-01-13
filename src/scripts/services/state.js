/* globals performance */
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
  .service('state', ['data',
  'util',
  function(data, util) {
    let sv = this;
    sv.hoverElement = '';
    sv.export = '';
    sv.player = {};
    sv.loading = true;
    sv.fasterTicks = false;
    sv.toast = [];
    sv.isToastVisible = false;
    let newElements = [];
    let updateFunctions = {};
    sv.reactionsCache = {};
    sv.redoxesCache = {};
    sv.reactions = [];

    sv.deleteToast = function() {
      sv.toast.shift();
      if (sv.toast.length > 0) {
        sv.isToastVisible = true;
        util.delayedExec(performance.now(),performance.now(), 2500, () => sv.removeToast());
      }
    };

    sv.removeToast = function() {
      sv.isToastVisible = false;
      util.delayedExec(performance.now(),performance.now(), 350, () => sv.deleteToast());
    };

    sv.addToast = function (t) {
      sv.toast.push(t);
      if (sv.toast.length === 1) {
        sv.isToastVisible = true;
        util.delayedExec(performance.now(),performance.now(), 2500, () => sv.removeToast());
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
