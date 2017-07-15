/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reactor', function() {
  let spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should check if the cost of a synthesis is met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:0};
      player.resources.p = {number:10};
      player.syntheses = {};
      player.syntheses['1H-p'] = {};
      player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isSynthesisCostMet(player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a synthesis is met 2', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:2};
      player.resources.p = {number:0};
      player.syntheses = {};
      player.syntheses['1H-p'] = {};
      player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isSynthesisCostMet(player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a synthesis is met 3', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:2};
      player.resources.p = {number:10};
      player.syntheses = {};
      player.syntheses['1H-p'] = {};
      player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isSynthesisCostMet(player, '1H-p');

      expect(value).toEqual(true);
    });

    it('should purchase as many synthesis as requested', function() {
      let player = {syntheses:{},resources:{}};
      player.resources.H2 = {number:32};
      player.resources.O2 = {number:32};
      player.syntheses.H2O = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buySynthesis(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(20);
      expect(player.resources.O2.number).toEqual(26);
      expect(player.syntheses.H2O.number).toEqual(4);
    });

    it('should purchase as many synthesis as possible', function() {
      let player = {syntheses:{},resources:{}};
      player.resources.H2 = {number:10};
      player.resources.O2 = {number:32};
      player.syntheses.H2O = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buySynthesis(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(2);
      expect(player.resources.O2.number).toEqual(28);
      expect(player.syntheses.H2O.number).toEqual(3);
    });

    it('should not purchase negative synthesis', function() {
      let player = {syntheses:{},resources:{}};
      player.resources.H2 = {number:32};
      player.resources.O2 = {number:32};
      player.syntheses.H2O = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buySynthesis(player, 'H2O',-3);

      expect(player.resources.H2.number).toEqual(32);
      expect(player.resources.O2.number).toEqual(32);
      expect(player.syntheses.H2O.number).toEqual(1);
    });

    it('should not purchase synthesis if the cost is not met', function() {
      let player = {syntheses:{},resources:{}};
      player.resources.H2 = {number:2};
      player.resources.O2 = {number:32};
      player.syntheses.H2O = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buySynthesis(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(2);
      expect(player.resources.O2.number).toEqual(32);
      expect(player.syntheses.H2O.number).toEqual(1);
    });
  });

  describe('update', function() {
    it('should process synthesis', function() {
      let player = spec.data.start_player;
      player.syntheses.H2O = {};
      player.syntheses.H2O.number = 2;
      player.syntheses.H2O.active = 2;
      player.resources.H2.number = 10;
      player.resources.O2.number = 5;
      spec.data.syntheses = {};
      spec.data.syntheses.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.state.update(player);

      expect(player.resources.H2.number).toEqual(2);
      expect(player.resources.O2.number).toEqual(1);
      expect(player.resources.H2O.number).toEqual(8);
    });
  });
});
