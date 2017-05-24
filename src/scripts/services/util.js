/* globals Ziggurat */
'use strict';

angular
  .module('game')
  .service('util', ['numberFilter',
    '$sce',
    '$locale',
    'data',
    function(numberFilter, $sce, $locale, data) {
      // Polyfill for some browsers
      Number.parseFloat = parseFloat;
      Number.isInteger = Number.isInteger || function(value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
      };
      let formats = $locale.NUMBER_FORMATS;
      this.numberGenerator = new Ziggurat();

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
          // And it is displayed in with superscript
          return numberFilter(exponential[0], 4) +
            ' &#215; 10<sup>' +
            this.prettifyNumber(exponent) +
            '</sup>';
        }
        return mangleCeroes(number, 4);
      };

      // FIXME: it turns out we need this abomination since default numberFilter
      // uses 3 decimals and we need 4 (for the isotopes proportions precision)
      // and if you use decimals, it attaches 0's at the end
      function mangleCeroes(input, fractionSize) {
        //Get formatted value

        let formattedValue = numberFilter(input, fractionSize);
        //get the decimalSepPosition
        let decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);
        //If no decimal just return
        if (decimalIdx === -1) {
          return formattedValue;
        }

        let whole = formattedValue.substring(0, decimalIdx);
        let decimal = (Number(formattedValue.substring(decimalIdx)) || '').toString();

        return whole + decimal.substring(1);
      }

      this.randomDraw = function(number, p) {
        let production;
        let mean = number * p;
        if (p < 0.01) {
          // using Poisson distribution (would get slow for large numbers. there are fast formulas but I don't know
          // how good they are)
          production = this.getPoisson(mean);
        } else {
          // Gaussian distribution
          let q = 1 - p;
          let variance = number * p * q;
          let std = Math.sqrt(variance);
          production = Math.round(this.numberGenerator.nextGaussian() * std + mean);
        }
        if (production > number) {
          production = number;
        }
        if (production < 0) {
          production = 0;
        }
        return production;
      };

      this.getPoisson = function(lambda) {
        let L = Math.exp(-lambda);
        let p = 1.0;
        let k = 0;

        do {
          k++;
          p *= Math.random();
        } while (p > L);

        return k - 1;
      };

      this.trustHTML = function(html) {
        return $sce.trustAsHtml(html);
      };
    }
  ]);
