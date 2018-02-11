/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Upgrades', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.upgrades = {
      '1-1': {
        price: 100,
        tiers: [
          '1'
        ],
        deps: [],
        exotic_deps: [],
        dark_deps: [],
        power: 2
      }
    };
  });

  describe('purchase functions', function() {
    it('should execute all upgrade functions', function () {
      for(let key of Object.keys(spec.originalData)){
        spec.data[key] = angular.copy(spec.originalData[key]);
      }
      let player = angular.copy(spec.data.start_player);
      player.element_slots = [angular.copy(spec.data.element_slot)];
      player.element_slots[0].element = 'H';
      for(let key in spec.data.upgrades){
        player.element_slots[0].upgrades[key] = true;
      }

      spec.state.update(player);

      let args = {
        production: 0,
        resource: '3H'
      };

      spec.state.player.exotic_upgrades = {'H':{}};
      for(let key in spec.data.exotic_upgrades){
        spec.state.player.exotic_upgrades.H[key] = true;
      }

      spec.upgradeService.executeAll(spec.data.exotic_upgrades, spec.state.player.exotic_upgrades.H, ['production', 'exotic'], args);

      args = {
        production: 0,
        resource: 'H-'
      };

      spec.upgradeService.executeAll(spec.data.exotic_upgrades, spec.state.player.exotic_upgrades.H, ['production', 'exotic'], args);

      args = {
        production: 0,
        resource: 'H2'
      };

      spec.upgradeService.executeAll(spec.data.exotic_upgrades, spec.state.player.exotic_upgrades.H, ['production', 'exotic'], args);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = 110;
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': false
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0], spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = 10;
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': false
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0], spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = 10;
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': true
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0], spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(true);
    });

    it('should buy all upgrades it can afford', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = 1500;
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': false,
          '1-2': false,
          '1-3': false
        }
      }];
      spec.data.upgrades = {
        '1-3': {
          price: 10000,
          tiers: [
            '1'
          ],
          deps: [],
          exotic_deps: [],
          dark_deps: [],
          power: 2
        },
        '1-2': {
          price: 1000,
          tiers: [
            '1'
          ],
          deps: [],
          exotic_deps: [],
          dark_deps: [],
          power: 2
        },
        '1-1': {
          price: 100,
          tiers: [
            '1'
          ],
          deps: [],
          exotic_deps: [],
          dark_deps: [],
          power: 2
        }
      };

      spec.upgrades.visibleUpgrades = function(){return ['1-1','1-2','1-3'];};

      spec.upgradeService.buyAll(spec.state.player,
          spec.state.player.element_slots[0].upgrades,
          Object.keys(spec.data.upgrades),
          spec.data.upgrades,
          '1H');

      expect(spec.state.player.resources['1H']).toEqual(400);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(true);
      expect(spec.state.player.element_slots[0].upgrades['1-2']).toEqual(true);
      expect(spec.state.player.element_slots[0].upgrades['1-3']).toEqual(false);
    });
  });

  describe('visibility functions', function() {
      it('should show if an upgrade is visible', function() {
        spec.state.player.exotic_upgrades = {
          H: {
            x3: false
          }
        };
        spec.state.player.element_slots = [{
          element: 'H',
          generators:{
            '1': 1,
            '2': 0
          },
          upgrades: {
            '1-1': true,
            '1-2': false,
            '1-3': false,
            '2-1': false
          }
        }];
        spec.data.upgrades = {
          '1-1': {
            tiers: [
              '1'
            ],
            deps: [],
            exotic_deps: [],
            dark_deps: []
          },
          '1-2': {
            tiers: [
              '1'
            ],
            deps: [
              '1-1'
            ],
            exotic_deps: [
              'x3'
            ],
            dark_deps: []
          },
          '1-3': {
            tiers: [
              '1'
            ],
            deps: [
              '1-2'
            ],
            exotic_deps: [
              'x4'
            ],
            dark_deps: []
          },
          '2-1': {
            tiers: [
              '2'
            ],
            deps: [],
            exotic_deps: [],
            dark_deps: []
          }
        };

        let values = spec.upgrades.visibleUpgrades(spec.state.player.element_slots[0], spec.state.player);

        expect(values).toEqual(['1-1']);
      });

      it('should show if an upgrade is visible 2', function() {
        spec.state.player.exotic_upgrades = {
          H: {
            x3: true
          }
        };
        spec.state.player.element_slots = [{
          element: 'H',
          generators:{
            '1': 1,
            '2': 0
          },
          upgrades: {
            '1-1': true,
            '1-2': false,
            '1-3': false,
            '2-1': false
          }
        }];
        spec.data.upgrades = {
          '1-1': {
            name: '1',
            tiers: [
              '1'
            ],
            deps: [],
            exotic_deps: [],
            dark_deps: []
          },
          '1-2': {
            name: '2',
            tiers: [
              '1'
            ],
            deps: [
              '1-1'
            ],
            exotic_deps: [
              'x3'
            ],
            dark_deps: []
          },
          '1-3': {
            name: '3',
            tiers: [
              '1'
            ],
            deps: [
              '1-2'
            ],
            exotic_deps: [
              'x4'
            ],
            dark_deps: []
          },
          '2-1': {
            name: '2-1',
            tiers: [
              '2'
            ],
            deps: [],
            exotic_deps: [],
            dark_deps: []
          }
        };

        let values = spec.upgrades.visibleUpgrades(spec.state.player.element_slots[0], spec.state.player);

        expect(values).toEqual(['1-1','1-2']);
      });
  });
});
