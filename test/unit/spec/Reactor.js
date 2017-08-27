/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reactor', function() {
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

  describe('prices and cost', function() {
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
  });

  describe('visibility functions', function() {

  });
});
