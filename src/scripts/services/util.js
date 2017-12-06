/* globals numberformat */
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
        if (typeof number === 'undefined' || number === null) return null;
        if (number === '') return '';
        if (number === Infinity) return '&infin;';
        if (number === 0) return '0';
        return numberformat.format(number, player.options.numberformat);
      };

      sv.addResource = function(player, scope, key, quantity, state){
        player.resources[key].number += quantity;
        sv.addStatistic(player, scope, key, quantity);
        if (quantity > 0 && !player.resources[key].unlocked) {
          player.resources[key].unlocked = true;
          state.addNew(key);
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
      }
    }
  ]);
