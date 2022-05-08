/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Dark', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.constants = {
      'DARK_START': 100,
      'DARK_STEP': 2,
    };
    spec.state.registerUpdate('exotic', spec.exotic.upgrade);
  });

  describe('prestige', function() {
    it('should produce prestige currency', function() {
      spec.data.elements.H = {
        exotic:'xH'
      };
      spec.data.elements.O = {
        exotic:'xO'
      };
      spec.state.player.resources.xH = 0;
      spec.state.player.resources.xO = 0;
      spec.state.player.statistics.dark_run.xH = 1e8;
      spec.state.player.statistics.dark_run.xO = 1e8;

      spec.dark.update(spec.state.player);
      let production = spec.dark.darkProduction();

      expect(production).toEqual(16);
    });

    it('should prestige', function() {
      spec.data.elements.H = {
        exotic:'xH',
        includes: ['1H'],
        reactions: ['H.OH-H2O']
      };
      spec.data.resources = {
        '1H': {elements: {H: 1}, type: ['isotope']}
      };
      spec.data.exotic_upgrades = {
        x3: {}
      };
      spec.state.player.elements.H = true;
      spec.state.player.resources['1H'] = 1e4;
      spec.state.player.resources.xH = 1e8;
      spec.state.player.resources.dark_matter = null;
      spec.state.player.statistics.dark_run.xH = 1e8;
      spec.state.player.exotic_upgrades = {
        'H':{
          x3: true
        }
      };
      spec.data.element_slot = {
        upgrades: {
          '1-1': false
        },
        generators: {
          '1': 0,
          '2': 0
        },
        reactions: [],
        redoxes: []
      };
      spec.state.player.element_slots = [{
          element: 'H',
          upgrades: {
            '1-1': true
          },
          generators: {
            '1': 99,
            '2': 99
          },
          reactions: [{
            active: true,
            reaction: ['H.OH-H2O']
          }]
        }
      ];
      spec.state.player.fusion = [{
        active: true,
        running: true,
        beam: {
          name: '1H',
          number: 0
        },
        target: {
          name: '1H',
          number: 0
        },
        eV: 0
      }];

      spec.dark.update(spec.state.player);
      spec.dark.darkPrestige(spec.state.player);

      expect(spec.state.player.element_slots[0]).toBeNull();
      expect(spec.state.player.exotic_upgrades.H.x3).toBeFalsy();
      expect(spec.state.player.resources['1H']).toEqual(0);
      expect(spec.state.player.resources.xH).toEqual(0);
      expect(spec.state.player.resources.dark_matter).toEqual(8);
      expect(spec.state.player.statistics.exotic_run).toEqual({});
      expect(spec.state.player.statistics.dark_run).toEqual({});
      expect(spec.state.player.fusion[0].active).toBeFalsy();
      expect(spec.state.player.fusion[0].running).toBeFalsy();
    });

    it('should reset elements that haven\'t made a exotic prestige', function() {
      spec.data.elements.H = {
        exotic:'xH',
        includes: ['1H'],
        reactions: ['H.OH-H2O']
      };
      spec.data.resources = {
        '1H': {elements: {H: 1}, type: ['isotope']}
      };
      spec.data.exotic_upgrades = {
        x3: {}
      };
      spec.state.player.elements.H = true;
      spec.state.player.resources['1H'] = 1e4;
      spec.state.player.resources.xH = null;
      spec.state.player.resources.dark_matter = null;
      spec.state.player.exotic_upgrades = {
        'H':{
          x3: true
        }
      };
      spec.data.element_slot = {
        upgrades: {
          '1-1': false
        },
        generators: {
          '1': 0,
          '2': 0
        },
        reactions: [],
        redoxes: []
      };
      spec.state.player.element_slots = [{
          element: 'H',
          upgrades: {
            '1-1': true
          },
          generators: {
            '1': 99,
            '2': 99
          },
          reactions: [{
            active: true,
            reaction: ['H.OH-H2O']
          }]
        }
      ];

      spec.dark.darkPrestige(spec.state.player);

      expect(spec.state.player.element_slots[0]).toBeNull();
      expect(spec.state.player.exotic_upgrades.H.x3).toBeFalsy();
      expect(spec.state.player.resources['1H']).toEqual(0);
      expect(spec.state.player.resources.xH).toEqual(null);
      expect(spec.state.player.resources.dark_matter).toEqual(null);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.data.dark_upgrades = {
        test: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = 110;
      spec.state.player.dark_upgrades.test = false;

      spec.dark.buyDarkUpgrade('test', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(10);
      expect(spec.state.player.dark_upgrades.test).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.data.dark_upgrades = {
        test: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = 10;
      spec.state.player.dark_upgrades.test = false;

      spec.dark.buyDarkUpgrade('test', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(10);
      expect(spec.state.player.dark_upgrades.test).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.data.dark_upgrades = {
        test: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = 110;
      spec.state.player.dark_upgrades.test = true;

      spec.dark.buyDarkUpgrade('test', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(110);
      expect(spec.state.player.dark_upgrades.test).toEqual(true);
    });
  });

  describe('visibility functions', function() {
      it('should show if a dark upgrade is visible', function() {
        spec.data.dark_upgrades = {
          test: {
            price: 100,
            deps: []
          }
        };
        spec.state.player.element_slots = [{
          element: 'H'
        }];

        let values = spec.dark.visibleDarkUpgrades(spec.state.player);

        expect(values).toEqual(['test']);
      });
  });
});
