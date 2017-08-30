/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Supernova', function() {
  let spec = {};

  commonSpec(spec);

  describe('prestige', function() {
    it('should produce prestige currency', function() {
      spec.data.elements.H = {
        exotic:'xH',
        includes: ['1H']
      };
      spec.data.resources = {
        '1H': {elements: {H: 1}, type: ['isotope']}
      };
      spec.state.current_element = 'H';
      spec.state.player.resources['1H'] = {number:1e8, unlocked: true};

      let production = spec.supernova.exoticProduction();

      expect(production).toEqual({'xH': 5});
    });

    it('should not produce prestige currency for small quantities', function() {
      spec.data.elements.H = {
        exotic:'xH',
        includes: ['1H']
      };
      spec.data.resources = {
        '1H': {elements: {H: 1}, type: ['isotope']}
      };
      spec.state.current_element = 'H';
      spec.state.player.resources['1H'] = {number:1e5, unlocked: true};

      let production = spec.supernova.exoticProduction();

      expect(production).toEqual({'xH': 0});
    });

    it('should produce dual currency for compounds', function() {
      spec.data.elements.H = {
        exotic:'xH',
        includes: ['1H', 'H2O']
      };
      spec.data.elements.O = {
        exotic:'xO',
        includes: ['H2O']
      };
      spec.data.resources = {
        '1H': {elements: {H: 1}, type: ['isotope']},
        'H2O': {elements: {H: 2, O: 1}, type: ['molecule']}
      };
      spec.state.current_element = 'H';
      spec.state.player.resources['1H'] = {number:0, unlocked: true};
      spec.state.player.resources.H2O = {number:1e8, unlocked: true};

      let production = spec.supernova.exoticProduction();

      expect(production).toEqual({'xH': 41, 'xO': 41});
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
      spec.state.player.resources.xH = {number:0, unlocked: false};
      spec.state.player.elements.H = {
        upgrades: {
          '1-1': true
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

      spec.supernova.exoticPrestige();

      expect(spec.state.player.elements.H.upgrades['1-1']).toBeFalsy();
      expect(spec.state.player.reactions[0].active).toBeFalsy();
      expect(spec.state.player.elements.H.generators['1']).toEqual(1);
      expect(spec.state.player.elements.H.generators['2']).toEqual(0);
      expect(spec.state.player.resources['1H'].number).toEqual(0);
      expect(spec.state.player.resources.xH.number).toEqual(5);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.data.elements.H = {exotic:'xH'};
      spec.data.exotic_upgrades = {
        x3: {
          price: 100,
          exotic_deps: [],
          dark_deps: []
        }
      };
      spec.state.player.resources.xH = {number:110};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = false;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(10);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.data.elements.H = {exotic:'xH'};
      spec.data.exotic_upgrades = {
        x3: {
          price: 100,
          exotic_deps: [],
          dark_deps: []
        }
      };
      spec.state.player.resources.xH = {number:10};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = false;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(10);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.data.elements.H = {exotic:'xH'};
      spec.data.exotic_upgrades = {
        x3: {
          price: 100,
          exotic_deps: [],
          dark_deps: []
        }
      };
      spec.state.player.resources.xH = {number:110};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = true;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(110);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(true);
    });
  });

  describe('visibility functions', function() {
      it('should show if an exotic upgrade is visible', function() {
        spec.data.exotic_upgrades = {
          x3: {
            price: 100,
            exotic_deps: [],
            dark_deps: []
          }
        };
        spec.state.player.elements.H = {
          upgrades: [],
          exotic_upgrades: []
        };

        let values = spec.supernova.visibleExoticUpgrades('H');

        expect(values).toEqual(['x3']);
      });
  });
});
