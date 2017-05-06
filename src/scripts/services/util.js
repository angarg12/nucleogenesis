/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

angular
.module('incremental')
.service('util',
['numberFilter',
'$sce',
'$locale',
'data',
function(numberFilter, $sce, $locale, data) {
  // Polyfill for some browsers
  Number.parseFloat = parseFloat;
  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };
  var formats = $locale.NUMBER_FORMATS;
  this.numberGenerator = new Ziggurat();

  this.getHTML = function (resource) {
    var html = data.html[resource];
    if(html === undefined){
      html = data.resources[resource].html;
    }
    if(html === undefined){
      return resource;
    }
    return html;
  };

  this.prettifyNumber = function (number) {
    if(typeof number == 'undefined') {
      return;
    }
    if(number === "") {
      return "";
    }
    if(number == Infinity) {
      return "&infin;";
    }
    if(number > 1e6) {
      // Very ugly way to extract the mantisa and exponent from an exponential string
      var exponential = number.toPrecision(6).split("e");
      var exponent = parseFloat(exponential[1].split("+")[1]);
      // And it is displayed in with superscript
      return mangleCeroes(exponential[0], 4) +
             " &#215; 10<sup>" +
             this.prettifyNumber(exponent) +
             "</sup>";
    }
    return mangleCeroes(number, 4);
  };

  // FIXME: it turns out we need this abomination since default numberFilter
  // uses 3 decimals and we need 4 (for the isotopes proportions precision)
  // and if you use decimals, it attaches 0's at the end
  var mangleCeroes = function(input, fractionSize) {
    //Get formatted value
    var formattedValue = numberFilter(input, fractionSize);
    //get the decimalSepPosition
    var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);
    //If no decimal just return
    if (decimalIdx === -1){
      return formattedValue;
    }

    var whole = formattedValue.substring(0, decimalIdx);
    var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

    return whole +  decimal.substring(1);
  };

  this.randomDraw = function (number, p) {
    var production;
    var mean = number * p;
    if(p < 0.01) {
      // using Poisson distribution (would get slow for large numbers. there are fast formulas but I don't know
      // how good they are)
      production = this.getPoisson(mean);
    } else {
      // Gaussian distribution
      var q = 1 - p;
      var variance = number * p * q;
      var std = Math.sqrt(variance);
      production = Math.round(this.numberGenerator.nextGaussian() * std + mean);
    }
    if(production > number) {
      production = number;
    }
    if(production < 0) {
      production = 0;
    }
    return production;
  };

  this.getPoisson = function (lambda) {
    var L = Math.exp(-lambda);
    var p = 1.0;
    var k = 0;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  };

  this.trustHTML = function (html) {
    return $sce.trustAsHtml(html);
  };
}]);
