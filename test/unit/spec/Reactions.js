/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Reactions', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.global_upgrades = {
      'reaction_slots': {
        'price': {
          'eV': 10000
        },
        'name': 'Reaction slots',
        'description': 'Number of slots available for reactions',
        'tiers': [],
        'deps': [],
        'exotic_deps': [],
        'dark_deps': [],
        'power': 1,
        'power_mult': 1,
        'price_exp': 2,
        'repeatable': true
      },
      'reaction_bandwidth': {
        'price': {
          'eV': 100
        },
        'name': 'Reaction bandwidth',
        'description': 'bandwidth available for reactions',
        'tiers': [],
        'deps': [],
        'exotic_deps': [],
        'dark_deps': [],
        'power': 100,
        'power_poly': 2,
        'price_exp': 1.15,
        'repeatable': true
      }
    };
    spec.state.player
  });

  describe('update', function() {
    it('should process reaction', function() {
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.state.player.global_upgrades.reaction_bandwidth = 1;
      spec.state.player.resources = {
        'H2': {
          number: 300
        },
        'O2': {
          number: 150
        },
        'H2O': {
          number: 0
        }
      };
      spec.state.player.reactions = [
        {
          active: true,
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        }
      ];

      spec.state.update(spec.state.player);

      expect(spec.state.player.resources.H2.number).toEqual(100);
      expect(spec.state.player.resources.O2.number).toEqual(50);
      expect(spec.state.player.resources.H2O.number).toEqual(200);
    });

    it('should add reaction', function () {
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.data.reactions = {
        '1': {
          active: true,
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        }
      };

      spec.reactions.addReaction(spec.state.player, '1');

      expect(spec.state.player.reactions.length).toEqual(1);
    });

    it('should not add reaction if no slots are available', function () {
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.state.player.reactions = [1];

      expect(spec.state.player.reactions.length).toEqual(1);

      spec.reactions.addReaction(spec.state.player);

      expect(spec.state.player.reactions.length).toEqual(1);
    });

    it('should remove reaction', function () {
      spec.state.player.reactions = ['item'];

      expect(spec.state.player.reactions.length).toEqual(1);

      spec.reactions.removeReaction(spec.state.player, 'item');

      expect(spec.state.player.reactions.length).toEqual(0);
    });

    it('should calculate reaction power', function () {
      spec.state.player.global_upgrades.reaction_bandwidth = 2;

      let power = spec.reactions.reactionPower(spec.state.player);

      expect(power).toEqual(400);
    });
  });

  describe('visibility functions', function() {
    it('should show visible reactions', function() {
      spec.state.player.reactions = [
        {
          active: true,
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        },
        {
          active: true,
          reaction: {
            reactant: {'He':2},
            product: {'2He':1},
            elements: ['He']
          }
        }
      ];

      let visible = spec.reactions.visibleReactions('H');

      expect(visible).toEqual([{
        active: true,
        reaction: {
          reactant: {'H2':2,'O2':1},
          product: {'H2O':2},
          elements: ['H','O']
        }
      }]);
    });

    it('should show misc reactions', function() {
      spec.state.player.reactions = [
        {
          active: true,
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        },
        {
          active: true,
          reaction: {
            reactant: {'e-':1, 'e+':1},
            product: {'eV':1000},
            elements: []
          }
        }
      ];

      let visible = spec.reactions.visibleReactions('');

      expect(visible).toEqual([{
        active: true,
        reaction: {
          reactant: {'e-':1, 'e+':1},
          product: {'eV':1000},
          elements: []
        }
      }]);
    });

    it('should show available reactions', function() {
      spec.data.reactions = {
        '1': {
          'reactant': {
            'H': 1,
            'H': 1
          },
          'product': {
            'H2': 1
          },
          'elements': [
            'H'
          ]
        },
        '2': {
          'reactant': {
            'H': 1,
            'He': 1
          },
          'product': {
            'HHe': 1
          },
          'elements': [
            'He',
            'H'
          ]
        },
        '3': {
          'reactant': {
            'C': 1,
            'O': 2
          },
          'product': {
            'CO2': 1
          },
          'elements': [
            'C',
            'O'
          ]
        }
      };

      spec.state.player.resources = {
        H: {unlocked: true},
        He: {unlocked: false},
        C: {unlocked: true},
        O: {unlocked: true}
      };

      let available = spec.reactions.availableReactions('H');

      expect(available).toEqual(['1']);
    });
  });
});
