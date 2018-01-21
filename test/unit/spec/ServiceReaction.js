/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reaction service', function() {
  let spec = {};

  commonSpec(spec);

  describe('react', function() {
    it('should react the number specified', function() {
      spec.data.resources = {
        '1H': {elements:{H:1}},
        OH: {elements:{H:1, O:1}}
      };
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = 10;
      spec.state.player.resources.OH = 10;
      spec.state.player.resources.H2O = 0;
      spec.state.player.statistics.exotic_run = {H:{},O:{}};
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

      spec.reaction.react(5, reaction, spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(5);
      expect(spec.state.player.resources.OH).toEqual(5);
      expect(spec.state.player.resources.H2O).toEqual(5);
      expect(spec.state.player.statistics.exotic_run.H.H2O).toEqual(5);
      expect(spec.state.player.statistics.exotic_run.O.H2O).toEqual(5);
      expect(spec.state.player.statistics.dark_run.H2O).toEqual(5);
      expect(spec.state.player.statistics.all_time.H2O).toEqual(5);
    });

    it('should return if the number specified is invalid', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = 50;
      player.resources.eV = 200;
      player.resources.p = 1;
      player.resources['e-'] = 0;
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

      expect(player.resources['1H']).toEqual(50);
      expect(player.resources.eV).toBeCloseTo(200,4);
      expect(player.resources.p).toEqual(1);
      expect(player.resources['e-']).toEqual(0);
    });

    it('should return if the number specified is negative', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = 50;
      player.resources.eV = 200;
      player.resources.p = 1;
      player.resources['e-'] = 0;
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

      expect(player.resources['1H']).toEqual(50);
      expect(player.resources.eV).toBeCloseTo(200,4);
      expect(player.resources.p).toEqual(1);
      expect(player.resources['e-']).toEqual(0);
    });

    it('should return if the cost is not met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = 2;
      player.resources.OH = 2;
      player.resources.H2O = 0;
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

      expect(player.resources['1H']).toEqual(2);
      expect(player.resources.OH).toEqual(2);
      expect(player.resources.H2O).toEqual(0);
    });
  });
});
