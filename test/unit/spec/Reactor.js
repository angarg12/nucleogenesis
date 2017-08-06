/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reactor', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.constants = {
      REACT_PRICE_INCREASE: 1.15,
      REACT_POWER_INCREASE: 2
    };
  });

  describe('prices and cost', function() {
    it('should check if the cost of a reaction is met', function() {
      spec.state.player.resources['1H-'] = {number:0};
      spec.state.player.resources.p = {number:10};
      spec.state.player.reactions['1H-p'] = {};
      spec.state.player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(spec.state.player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 2', function() {
      spec.state.player.resources['1H-'] = {number:2};
      spec.state.player.resources.p = {number:0};
      spec.state.player.reactions['1H-p'] = {};
      spec.state.player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(spec.state.player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 3', function() {
      spec.state.player.resources['1H-'] = {number:2};
      spec.state.player.resources.p = {number:10};
      spec.state.player.reactions['1H-p'] = {};
      spec.state.player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(spec.state.player, '1H-p');

      expect(value).toEqual(true);
    });

    it('should purchase as many reaction as requested', function() {
      spec.state.player.resources.H2 = {number:32};
      spec.state.player.resources.O2 = {number:32};
      spec.state.player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(spec.state.player, 'H2O',3);

      expect(spec.state.player.resources.H2.number).toEqual(20);
      expect(spec.state.player.resources.O2.number).toEqual(26);
      expect(spec.state.player.reactions.H2O.number).toEqual(4);
    });

    it('should purchase as many reaction as possible', function() {
      spec.state.player.resources.H2 = {number:10};
      spec.state.player.resources.O2 = {number:32};
      spec.state.player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(spec.state.player, 'H2O',3);

      expect(spec.state.player.resources.H2.number).toEqual(2);
      expect(spec.state.player.resources.O2.number).toEqual(28);
      expect(spec.state.player.reactions.H2O.number).toEqual(3);
    });

    it('should not purchase negative reaction', function() {
      spec.state.player.resources.H2 = {number:32};
      spec.state.player.resources.O2 = {number:32};
      spec.state.player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(spec.state.player, 'H2O',-3);

      expect(spec.state.player.resources.H2.number).toEqual(32);
      expect(spec.state.player.resources.O2.number).toEqual(32);
      expect(spec.state.player.reactions.H2O.number).toEqual(1);
    });

    it('should not purchase reaction if the cost is not met', function() {
      spec.state.player.resources.H2 = {number:2};
      spec.state.player.resources.O2 = {number:32};
      spec.state.player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(spec.state.player, 'H2O',3);

      expect(spec.state.player.resources.H2.number).toEqual(2);
      expect(spec.state.player.resources.O2.number).toEqual(32);
      expect(spec.state.player.reactions.H2O.number).toEqual(1);
    });
  });

  describe('update', function() {
    it('should process reaction', function() {
      spec.state.player.reactions.H2O = {
        number: 2,
        active: 2
      };
      spec.state.player.resources = {
        'H2': {
          number: 10
        },
        'O2': {
          number: 5
        },
        'H2O': {
          number: 0
        }
      };
      spec.data.reactions = {
        H2O: {
          reactant: {'H2':2,'O2':1},
          product: {'H2O':2},
          elements: ['H','O']
        }
      };

      spec.state.update(spec.state.player);

      expect(spec.state.player.resources.H2.number).toEqual(2);
      expect(spec.state.player.resources.O2.number).toEqual(1);
      expect(spec.state.player.resources.H2O.number).toEqual(8);
    });
  });

  describe('visibility functions', function() {
    it('should show visible reactions', function() {
      spec.state.player.achievements = {};
      spec.state.player.resources['1H-'] = {unlocked:true};
      spec.state.player.resources.p = {unlocked:true};
      spec.state.player.resources.H2 = {unlocked:true};
      spec.state.player.resources.O2 = {unlocked:false};
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      let values = spec.reactionTable.visibleSyntheses('H');

      expect(values).toEqual(['1H-p']);
    });
  });
});
