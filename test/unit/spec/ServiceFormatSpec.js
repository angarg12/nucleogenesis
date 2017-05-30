/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Format service', function() {
  let spec = {};

  commonSpec(spec);

  describe('formatting functions', function() {
    it('should format reactions', function() {
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      let value = spec.format.reactionFormat(1, spec.data.syntheses['1H-p']);

      expect(value).toEqual('H<sup>-</sup> + p <span class=\'icon\'>&#8594;</span> H<sub>2</sub>');
    });

    it('should format multiple reactions', function() {
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      let value = spec.format.reactionFormat(10, spec.data.syntheses['1H-p']);

      expect(value).toEqual('10 H<sup>-</sup> + 10 p <span class=\'icon\'>&#8594;</span> 10 H<sub>2</sub>');
    });

    it('should format single compounds', function() {
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      let value = spec.format.compoundFormat(1, spec.data.syntheses['1H-p'].product);

      expect(value).toEqual('H<sub>2</sub>');
    });

    it('should format mutiple compounds', function() {
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      let value = spec.format.compoundFormat(10, spec.data.syntheses['1H-p'].product);

      expect(value).toEqual('10 H<sub>2</sub>');
    });

    it('should format decay', function() {
      let value = spec.format.decayFormat(spec.data.resources['3H'].decay);

      expect(value).toEqual('<sup>3</sup>He<sup>+</sup> + e- + 18,610 eV');
    });

    it('should format decay without energy', function() {
      delete spec.data.resources['3H'].decay.decay_product.eV;

      let value = spec.format.decayFormat(spec.data.resources['3H'].decay);

      expect(value).toEqual('<sup>3</sup>He<sup>+</sup> + e-');
    });
  });
});
