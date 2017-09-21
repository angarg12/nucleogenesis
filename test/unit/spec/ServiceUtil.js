/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn */
/* jshint varstmt: false */
'use strict';

describe('Util service', function() {
  let spec = {};

  commonSpec(spec);

  describe('prettifyNumber', function() {
    it('should return infinity as a symbol', function() {
      let value = spec.util.prettifyNumber(Infinity);
      expect(value).toEqual('&infin;');
    });

    it('should return empty string as a empty', function() {
      let value = spec.util.prettifyNumber('');
      expect(value).toEqual('');
    });

    it('should return undefined as undefined', function() {
      let value = spec.util.prettifyNumber();
      expect(value).toBeNull();
    });

    it('should leave small numbers unchanged', function() {
      let value = spec.util.prettifyNumber(1);
      expect(value).toEqual('1');
    });

    it('should format numbers with group separation commas', function() {
      let value = spec.util.prettifyNumber(500000);
      expect(value).toEqual('500,000');
    });

    it('should format numbers in scientific notation', function() {
      let value = spec.util.prettifyNumber(1e24);
      expect(value).toEqual('1.0000 &#215; 10<sup>24</sup>');
    });
  });

  describe('misc functions', function() {
    it('should return globally defined HTML code', function() {
      spec.data.html = {
        'beta-': '&#946;<sup>-</sup>'
      };
      let value = spec.util.getHTML('beta-');

      expect(value).toEqual('&#946;<sup>-</sup>');
    });

    it('should return resource defined HTML code', function() {
      spec.data.resources = {
        '2H': {
          html: '<sup>2</sup>H'
        }
      };
      let value = spec.util.getHTML('2H');

      expect(value).toEqual('<sup>2</sup>H');
    });

    it('should return resources that don\'t have defined HTML code', function() {
      spec.data.resources = {
        'p': {}
      };
      let value = spec.util.getHTML('p');

      expect(value).toEqual('p');
    });
  });

  describe('random draw', function() {
    it('should return a normally distributed random number', function() {
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValues(0.5);

      let value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(16);
    });

    it('should not return negative value', function() {
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValues(-1000);

      let value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(0);
    });

    it('should not return overproduction', function() {
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValues(1000);

      let value = spec.util.randomDraw(1000, Math.log(2)/50);

      expect(value).toEqual(1000);
    });

    it('should use a gaussian distribution for very small probabilities', function() {
      let gaussian = spyOn(spec.util.gaussian,'nextGaussian');

      spec.util.randomDraw(1000, 1);

      expect(gaussian).toHaveBeenCalled();
    });
  });
});
