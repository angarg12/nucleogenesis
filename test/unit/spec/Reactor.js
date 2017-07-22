/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reactor', function() {
  let spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should check if the cost of a reaction is met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:0};
      player.resources.p = {number:10};
      player.reactions = {};
      player.reactions['1H-p'] = {};
      player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 2', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:2};
      player.resources.p = {number:0};
      player.reactions = {};
      player.reactions['1H-p'] = {};
      player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(player, '1H-p');

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 3', function() {
      let player = {};
      player.resources = {};
      player.resources['1H-'] = {number:2};
      player.resources.p = {number:10};
      player.reactions = {};
      player.reactions['1H-p'] = {};
      player.reactions['1H-p'].number = 0;
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };

      let value = spec.reactor.isReactionCostMet(player, '1H-p');

      expect(value).toEqual(true);
    });

    it('should purchase as many reaction as requested', function() {
      let player = {reactions:{},resources:{}};
      player.resources.H2 = {number:32};
      player.resources.O2 = {number:32};
      player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(20);
      expect(player.resources.O2.number).toEqual(26);
      expect(player.reactions.H2O.number).toEqual(4);
    });

    it('should purchase as many reaction as possible', function() {
      let player = {reactions:{},resources:{}};
      player.resources.H2 = {number:10};
      player.resources.O2 = {number:32};
      player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(2);
      expect(player.resources.O2.number).toEqual(28);
      expect(player.reactions.H2O.number).toEqual(3);
    });

    it('should not purchase negative reaction', function() {
      let player = {reactions:{},resources:{}};
      player.resources.H2 = {number:32};
      player.resources.O2 = {number:32};
      player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(player, 'H2O',-3);

      expect(player.resources.H2.number).toEqual(32);
      expect(player.resources.O2.number).toEqual(32);
      expect(player.reactions.H2O.number).toEqual(1);
    });

    it('should not purchase reaction if the cost is not met', function() {
      let player = {reactions:{},resources:{}};
      player.resources.H2 = {number:2};
      player.resources.O2 = {number:32};
      player.reactions.H2O = {number:1};
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      spec.reactor.buyReaction(player, 'H2O',3);

      expect(player.resources.H2.number).toEqual(2);
      expect(player.resources.O2.number).toEqual(32);
      expect(player.reactions.H2O.number).toEqual(1);
    });
  });

  describe('update', function() {
    it('should process reaction', function() {
      let player = spec.data.start_player;
      player.reactions.H2O = {};
      player.reactions.H2O.number = 2;
      player.reactions.H2O.active = 2;
      player.resources.H2.number = 10;
      player.resources.O2.number = 5;
      spec.data.reactions = {};
      spec.data.reactions.H2O = {
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

  describe('visibility functions', function() {
    it('should show visible reactions', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.reaction = 1;
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
