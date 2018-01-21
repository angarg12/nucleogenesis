/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Reactions', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.global_upgrades = {
      reaction_slots: {
        price: {
          eV: 10000
        },
        name: 'Reaction slots',
        description: 'Number of slots available for reactions',
        tiers: [],
        deps: [],
        exotic_deps: [],
        dark_deps: [],
        power: {
          base: 1,
          linear: 1
        },
        price_exp: 2,
        repeatable: true
      },
      reaction_bandwidth: {
        price: {
          eV: 100
        },
        name: 'Reaction bandwidth',
        description: 'bandwidth available for reactions',
        tiers: [],
        deps: [],
        exotic_deps: [],
        dark_deps: [],
        power: {
          base: 100,
          poly: 2
        },
        price_exp: 1.15,
        repeatable: true
      }
    };
    spec.data.resources = {
      H2: {elements:{H:2}},
      O2: {elements:{O:2}}
    };
  });

  describe('update', function() {
    it('should process reaction', function() {
      spec.data.elements = {
        'H': {
          main: '1H',
          electronegativity: 0
        }
      };
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.state.player.global_upgrades.reaction_bandwidth = 1;
      spec.state.player.global_upgrades_current.reaction_bandwidth = 1;
      spec.state.player.resources = {
        '1H': 0,
        'H2': 300,
        'O2': 150,
        'H2O': 0
      };
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [{
          active: true,
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        }],
        redoxes: []
      }];

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources.H2).toEqual(100);
      expect(spec.state.player.resources.O2).toEqual(50);
      expect(spec.state.player.resources.H2O).toEqual(200);
    });

    it('should add reaction', function () {
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.data.reactions = {
        '1': {
          reaction: {
            reactant: {'H2':2,'O2':1},
            product: {'H2O':2},
            elements: ['H','O']
          }
        }
      };
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: []
      }];

      spec.reactions.addReaction(spec.state.player, spec.state.player.element_slots[0], '1');

      expect(spec.state.player.element_slots[0].reactions.length).toEqual(1);
    });

    it('should not add reaction if no slots are available', function () {
      spec.state.player.global_upgrades.reaction_slots = 1;
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [1]
      }];

      expect(spec.state.player.element_slots[0].reactions.length).toEqual(1);

      spec.reactions.addReaction(spec.state.player, spec.state.player.element_slots[0], null);

      expect(spec.state.player.element_slots[0].reactions.length).toEqual(1);
    });

    it('should remove reaction', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: ['item']
      }];

      expect(spec.state.player.element_slots[0].reactions.length).toEqual(1);

      spec.reactions.removeReaction(spec.state.player.element_slots[0], 'item');

      expect(spec.state.player.element_slots[0].reactions.length).toEqual(0);
    });

    it('should calculate reaction power', function () {
      spec.state.player.global_upgrades.reaction_bandwidth = 2;
      spec.state.player.global_upgrades_current.reaction_bandwidth = 2;

      let power = spec.util.calculateValue(spec.data.global_upgrades.reaction_bandwidth.power.base,
                  spec.data.global_upgrades.reaction_bandwidth.power,
                  spec.state.player.global_upgrades_current.reaction_bandwidth);

      expect(power).toEqual(400);
    });
  });

  describe('visibility functions', function() {
    it('should show visible reactions', function() {
      let reactions = [{
        active: true,
        reaction: {
          reactant: {'H2':2,'O2':1},
          product: {'H2O':2},
          elements: ['H','O']
        }
      },{
        active: true,
        reaction: {
          reactant: {'e-':1, 'e+':1},
          product: {'eV':1000},
          elements: []
        }
      }];
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: reactions
      }];

      let visible = spec.reactions.visibleReactions(spec.state.player.element_slots[0], spec.state.player);

      expect(visible).toEqual(reactions);
    });

    it('should show available reactions', function() {
      spec.data.reactions = {
        '1': {
          'reactant': {
            'H': 2
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
        H: 0,
        He: null,
        C: 0,
        O: 0
      };
      spec.state.player.element_slots = [{
        element: 'H'
      }];

      let available = spec.reactions.availableReactions(spec.state.player.element_slots[0], spec.state.player);

      expect(available).toEqual(['1']);
    });
  });
});
