/* globals describe,commonSpec,it,expect,spyOn, */
// jshint varstmt: false
'use strict';

describe('Synthesis service', function() {
  var spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should check if the cost of a synthesis is met', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H-'] = {number:0};
      spec.state.player.resources.p = {number:10};
      spec.state.player.syntheses = {};
      spec.state.player.syntheses['1H-p'] = {};
      spec.state.player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      var value = spec.synthesis.isSynthesisCostMet('1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a synthesis is met 2', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H-'] = {number:2};
      spec.state.player.resources.p = {number:0};
      spec.state.player.syntheses = {};
      spec.state.player.syntheses['1H-p'] = {};
      spec.state.player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      var value = spec.synthesis.isSynthesisCostMet('1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a synthesis is met 3', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H-'] = {number:2};
      spec.state.player.resources.p = {number:10};
      spec.state.player.syntheses = {};
      spec.state.player.syntheses['1H-p'] = {};
      spec.state.player.syntheses['1H-p'].number = 0;
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      var value = spec.synthesis.isSynthesisCostMet('1H-p');

      expect(value).toEqual(true);
    });

    it('should return the price of a synthesis', function() {
      spec.state.player = {syntheses:{}};
      spec.state.player.syntheses.H2O = {};
      spec.state.player.syntheses.H2O.number = 2;
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      var value = spec.synthesis.synthesisPrice('H2O');

      expect(value).toEqual({'H2':4,'O2':2});
    });

    it('should purchase as many synthesis as requested', function() {
      spec.state.player = {syntheses:{},resources:{}};
      spec.state.player.resources['H2'] = {number:32};
      spec.state.player.resources['O2'] = {number:32};
      spec.state.player.syntheses['H2O'] = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.synthesis.buySynthesis('H2O',3);

      expect(spec.state.player.resources['H2'].number).toEqual(20);
      expect(spec.state.player.resources['O2'].number).toEqual(26);
      expect(spec.state.player.syntheses['H2O'].number).toEqual(4);
    });

    it('should purchase as many synthesis as possible', function() {
      spec.state.player = {syntheses:{},resources:{}};
      spec.state.player.resources['H2'] = {number:10};
      spec.state.player.resources['O2'] = {number:32};
      spec.state.player.syntheses['H2O'] = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.synthesis.buySynthesis('H2O',3);

      expect(spec.state.player.resources['H2'].number).toEqual(2);
      expect(spec.state.player.resources['O2'].number).toEqual(28);
      expect(spec.state.player.syntheses['H2O'].number).toEqual(3);
    });

    it('should not purchase negative synthesis', function() {
      spec.state.player = {syntheses:{},resources:{}};
      spec.state.player.resources['H2'] = {number:32};
      spec.state.player.resources['O2'] = {number:32};
      spec.state.player.syntheses['H2O'] = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.synthesis.buySynthesis('H2O',-3);

      expect(spec.state.player.resources['H2'].number).toEqual(32);
      expect(spec.state.player.resources['O2'].number).toEqual(32);
      expect(spec.state.player.syntheses['H2O'].number).toEqual(1);
    });

    it('should not purchase synthesis if the cost is not met', function() {
      spec.state.player = {syntheses:{},resources:{}};
      spec.state.player.resources['H2'] = {number:2};
      spec.state.player.resources['O2'] = {number:32};
      spec.state.player.syntheses['H2O'] = {number:1};
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.synthesis.buySynthesis('H2O',3);

      expect(spec.state.player.resources['H2'].number).toEqual(2);
      expect(spec.state.player.resources['O2'].number).toEqual(32);
      expect(spec.state.player.syntheses['H2O'].number).toEqual(1);
    });
  });

  describe('update', function() {
    it('should process synthesis', function() {
      spyOn(spec.achievement,'checkAchievements');

      spec.state.player = spec.data.start_player;
      spec.state.player.syntheses.H2O = {};
      spec.state.player.syntheses.H2O.number = 2;
      spec.state.player.syntheses.H2O.active = 2;
      spec.state.player.resources.H2.number = 10;
      spec.state.player.resources.O2.number = 5;
      spec.data.syntheses = {};
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.controller.update();

      expect(spec.state.player.resources.H2.number).toEqual(2);
      expect(spec.state.player.resources.O2.number).toEqual(1);
      expect(spec.state.player.resources.H2O.number).toEqual(8);
    });
  });
});
