/* globals numberformat */
/**
 util
 Utility service with misc. functions.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('util', ['prettyNumberFilter',
    '$sce',
    'data',
    'state',
    function(prettyNumber, $sce, data, state) {
      /* Return the HTML representation of an element, or the element itself
      if it doesn't have one */
      this.getHTML = function(resource) {
        let html = data.html[resource];
        if (typeof html === 'undefined' && data.resources[resource]) {
          html = data.resources[resource].html;
        }
        if (typeof html === 'undefined') {
          return resource;
        }
        return html;
      };

      this.prettifyNumber = function(number) {
        if (typeof number === 'undefined' || number === null) {
          return null;
        }
        if (number === '') {
          return '';
        }
        if (number === Infinity) {
          return '&infin;';
        }
        if (number === 0) {
          return '0';
        }
        return numberformat.format(number, state.player.numberformat);
      };

      this.addResource = function(player, key, quantity){
        player.resources[key].number += quantity;
        player.statistics.exotic_run[key] = player.statistics.exotic_run[key]+quantity || quantity;
        player.statistics.dark_run[key] = player.statistics.dark_run[key]+quantity || quantity;
        player.statistics.all_time[key] = player.statistics.all_time[key]+quantity || quantity;
        if (quantity > 0 && !player.resources[key].unlocked) {
          player.resources[key].unlocked = true;
          state.addNew(key);
        }
      }

      this.trustHTML = function(html) {
        return $sce.trustAsHtml(html);
      };
    }
  ]);
