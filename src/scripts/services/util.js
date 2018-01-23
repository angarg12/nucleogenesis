/* globals numberformat,window */
/**
 util
 Utility service with misc. functions.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('util', ['$sce',
    'data',
    function($sce, data) {
      let sv = this;
      /* Return the HTML representation of an element, or the element itself
      if it doesn't have one */
      sv.getHTML = function(resource) {
        let html = data.html[resource];
        if (typeof html === 'undefined' && data.resources[resource]) {
          html = data.resources[resource].html;
        }
        if (typeof html === 'undefined') {
          return resource;
        }
        return html;
      };

      sv.prettifyNumber = function(number, player) {
        if (typeof number === 'undefined' || number === null){
           return null;
        }
        if (number === ''){
           return '';
         }
        if (number === Infinity){
           return '&infin;';
         }
        if (number === 0){
           return '0';
         }
        return numberformat.format(number, player.options.numberformat);
      };

      sv.addResource = function(player, scope, key, quantity, state){
        if(quantity === 0){
          return;
        }
        sv.addStatistic(player, scope, key, quantity);
        if (player.resources[key] === null) {
          player.resources[key] = quantity;
          state.addNew(key);
        }else{
          player.resources[key] += quantity;
        }
      };

      /* Adds an statistic. Scope can be only all time, dark run,
        only for specific elements, or for all elements at once
      */
      sv.addStatistic = function(player, scope, key, value){
        setStatistic(player.statistics.all_time, key, value);
        if(scope === 'all_time'){
          return;
        }
        setStatistic(player.statistics.dark_run, key, value);
        if(scope === 'dark'){
          return;
        }
        if(scope === 'all_elements') {
          scope = Object.keys(data.elements);
        }
        for(let element of scope){
          player.statistics.exotic_run[element] = player.statistics.exotic_run[element] || {};
          setStatistic(player.statistics.exotic_run[element], key, value);
        }
      };

      function setStatistic(bucket, key, value){
        // If it is numeric, add it up
        if(!isNaN(parseFloat(value)) && isFinite(value)){
          bucket[key] = bucket[key]+value || value;
        // otherwise, replace
        }else{
          bucket[key] = value;
        }
      }

      sv.trustHTML = function(html) {
        return $sce.trustAsHtml(html);
      };

      sv.nextAmount = function (player, index, array) {
        player.options[index] = (player.options[index] + 1) % array.length;
      };

      sv.delayedExec = function(currentTs, eventTs, delay, callback) {
        if(currentTs-eventTs >= delay){
          callback();
        }else{
          window.requestAnimationFrame((ts) => sv.delayedExec(ts, eventTs, delay, callback));
        }
      };

      sv.prestigeProduction = function(number, start, power){
        number = number || 0;
        let production = Math.pow(Math.E,(-0.5+Math.sqrt(0.25+0.8686*Math.log(number/start)))/(2/Math.log(power*power))) || 0;
        return Math.round(Math.max(0, production));
      };

      sv.calculateValue = function(number, value, level){
        let result = number;
        if(value.linear){
           result *= level*value.linear;
         }
        if(value.poly){
           result *= Math.floor(Math.pow(level, value.poly));
         }
        if(value.exp){
           result *= Math.floor(Math.pow(value.exp, level));
         }
        return result;
      }
    }
  ]);
