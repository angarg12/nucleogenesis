/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reaction service', function() {
  let spec = {};

  commonSpec(spec);

  describe('react', function() {
    it('should react the number specified', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:10};
      player.resources.OH = {number:10};
      player.resources.H2O = {number:0};
      let reaction = {
          'reactant': {
            '1H': 1,
            'OH': 1
          },
          'product': {
            'H2O': 1
          },
          'elements': [
            'H',
            'O'
          ]
        };

      spec.reaction.react(5,reaction, player);

      expect(player.resources['1H'].number).toEqual(5);
      expect(player.resources.OH.number).toEqual(5);
      expect(player.resources.H2O.number).toEqual(5);
    });

    it('should return if the number specified is invalid', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};
      let reaction = {
          'reactant': {
            '1H': 1,
            'OH': 1
          },
          'product': {
            'H2O': 1
          },
          'elements': [
            'H',
            'O'
          ]
        };

      spec.reaction.react(0.5,reaction, player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(200,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });

    it('should return if the number specified is negative', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};
      let reaction = {
          'reactant': {
            '1H': 1,
            'OH': 1
          },
          'product': {
            'H2O': 1
          },
          'elements': [
            'H',
            'O'
          ]
        };

      spec.reaction.react(-10,reaction, player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(200,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });

    it('should return if the cost is not met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:2};
      player.resources.OH = {number:2};
      player.resources.H2O = {number:0};
      let reaction = {
          'reactant': {
            '1H': 1,
            'OH': 1
          },
          'product': {
            'H2O': 1
          },
          'elements': [
            'H',
            'O'
          ]
        };

      spec.reaction.react(5,reaction, player);

      expect(player.resources['1H'].number).toEqual(2);
      expect(player.resources.OH.number).toEqual(2);
      expect(player.resources.H2O.number).toEqual(0);
    });
  });
});
