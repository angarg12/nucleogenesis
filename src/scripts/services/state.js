'use strict';

angular
  .module('game')
  .service('state', [function() {
    this.currentElement = 'H';
    this.hoverElement = '';
    this.export = '';
    this.player = {};
    this.loading = true;
    let updateFunctions = [];

    this.init = function() {
      this.currentElement = 'H';
      this.hoverElement = '';
      this.export = '';
    };

    this.registerUpdate = function(func){
      updateFunctions.push(func);
    };

    this.update = function(player){
      for(let func of updateFunctions){
        func(player);
      }
    };
  }]);
