/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Dark', function() {
  let spec = {};

  commonSpec(spec);

  describe('prestige', function() {
    it('should produce prestige currency', function() {
      spec.data.elements.H = {
        exotic:'xH'
      };
      spec.data.elements.O = {
        exotic:'xO'
      };
      spec.state.player.resources.xH = {number:1e8, unlocked: true};
      spec.state.player.resources.xO = {number:1e8, unlocked: true};

      let production = spec.dark.darkProduction();

      expect(production).toEqual(36);
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
      spec.state.current_element = 'H';
      spec.state.player.resources['1H'] = {number:1e8, unlocked: true};
      spec.state.player.resources.xH = {number:1e8, unlocked: true};
      spec.state.player.resources.dark_matter = {number:0, unlocked: false};
      spec.state.player.elements.H = {
        upgrades: {
          '1-1': true
        },
        exotic_upgrades: {
          x3: true
        },
        generators: {
          '1': 99,
          '2': 99
        }
      };
      spec.state.player.reactions = [{
        active: true,
        reaction: ['H.OH-H2O']
      }];

      spec.dark.darkPrestige();

      expect(spec.state.player.elements.H.upgrades['1-1']).toBeFalsy();
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toBeFalsy();
      expect(spec.state.player.reactions[0].active).toBeFalsy();
      expect(spec.state.player.elements.H.generators['1']).toEqual(1);
      expect(spec.state.player.elements.H.generators['2']).toEqual(0);
      expect(spec.state.player.resources['1H'].number).toEqual(0);
      expect(spec.state.player.resources.xH.number).toEqual(0);
      expect(spec.state.player.resources.dark_matter.number).toEqual(18);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.data.dark_upgrades = {
        table: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = {number:110};
      spec.state.player.dark_upgrades.table = false;

      spec.dark.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(10);
      expect(spec.state.player.dark_upgrades.table).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.data.dark_upgrades = {
        table: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = {number:10};
      spec.state.player.dark_upgrades.table = false;

      spec.dark.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(10);
      expect(spec.state.player.dark_upgrades.table).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.data.dark_upgrades = {
        table: {
          price: 100,
          deps: []
        }
      };
      spec.state.player.resources.dark_matter = {number:110};
      spec.state.player.dark_upgrades.table = true;

      spec.dark.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(110);
      expect(spec.state.player.dark_upgrades.table).toEqual(true);
    });
  });

  describe('visibility functions', function() {
      it('should show if a dark upgrade is visible', function() {
        spec.data.dark_upgrades = {
          table: {
            price: 100,
            deps: []
          }
        };
        spec.state.player.elements.H = {
          upgrades: [],
          exotic_upgrades: []
        };

        let values = spec.dark.visibleDarkUpgrades('H');

        expect(values).toEqual(['table']);
      });
  });
});
