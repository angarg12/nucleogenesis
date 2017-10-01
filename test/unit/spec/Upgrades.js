/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Upgrades', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.global_upgrades = {
      redox_bandwidth: {
        price: {
          eV: 100
        },
        power: 100,
        power_poly: 2,
        price_exp: 1.15,
        repeatable: true
      }
    };
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

  describe('global purchase functions', function() {
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
    });

    it('should return false if an upgrade can\'t be bought', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = {number:0};

      let canBuy = spec.upgrades.canBuyGlobalUpgrade('redox_bandwidth');

      expect(canBuy).toBeFalsy();
    });

    it('should return true if an upgrade can be bought', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = {number:1e300};

      let canBuy = spec.upgrades.canBuyGlobalUpgrade('redox_bandwidth');

      expect(canBuy).toBeTruthy();
    });

    it('should buy an upgrade', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = {number:1e300};

      spec.upgrades.buyGlobalUpgrade('redox_bandwidth');

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(3);
    });

    it('should not buy an upgrade that it can\'t afford', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = {number:0};

      spec.upgrades.buyGlobalUpgrade('redox_bandwidth');

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(2);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = {number:110};
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': false
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0]);

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': false
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0]);

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = true;
      spec.state.player.element_slots = [{
        element: 'H',
        upgrades: {
          '1-1': true
        }
      }];

      spec.upgrades.buyUpgrade('1-1',spec.state.player.element_slots[0]);

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.element_slots[0].upgrades['1-1']).toEqual(true);
    });

    it('should buy all upgrades it can afford', function() {
      spec.data.elements.H = {main:'1H'};
      spec.state.player.resources['1H'] = {number:1500};
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

      spec.upgrades.visibleUpgrades = function(){return ['1-1','1-2','1-3']}

      spec.upgrades.buyAll(spec.state.player.element_slots[0]);

      expect(spec.state.player.resources['1H'].number).toEqual(400);
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

        let values = spec.upgrades.visibleUpgrades(spec.state.player.element_slots[0], spec.data.upgrades);

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

        let values = spec.upgrades.visibleUpgrades(spec.state.player.element_slots[0], spec.data.upgrades);

        expect(values).toEqual(['1-1','1-2']);
      });
  });
});
