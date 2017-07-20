/* globals Ziggurat, Poisson */
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
    function(prettyNumber, $sce, data) {
      this.gaussian = new Ziggurat();
      this.poisson = new Poisson();

      /* Return the HTML representation of an element, or the element itself
      if it doesn't have one */
      this.getHTML = function(resource) {
        let html = data.html[resource];
        if (typeof html === 'undefined') {
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
        if (number > 1e6) {
          // Very ugly way to extract the mantisa and exponent from an exponential string
          let exponential = number.toPrecision(6).split('e');
          let exponent = parseFloat(exponential[1].split('+')[1]);
          // And it is displayed with superscript
          return Number.parseFloat(exponential[0]).toFixed(4) +
            ' &#215; 10<sup>' +
            this.prettifyNumber(exponent) +
            '</sup>';
        }
        // we use a regex to remove trailing zeros, plus . (if necessary)
        return prettyNumber(number, 4);
      };

      this.randomDraw = function(number, p) {
        let production;
        let mean = number * p;
        //if (p < 0.01) {
          // using Poisson distribution (would get slow for large numbers.
          // there are fast formulas but I don't know how good they are)
          //production = this.poisson.getPoisson(mean);
        //} else {
          // Gaussian distribution
          let q = 1 - p;
          let variance = number * p * q;
          let std = Math.sqrt(variance);
          production = Math.round(this.gaussian.nextGaussian() * std + mean);
        //}
        if (production > number) {
          production = number;
        }
        if (production < 0) {
          production = 0;
        }
        return production;
      };

      this.trustHTML = function(html) {
        return $sce.trustAsHtml(html);
      };
    }
  ]);
