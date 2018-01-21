/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect, beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Mechanics', function() {
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
  });

  describe('global purchase functions', function() {
    it('should return false if an upgrade can\'t be bought', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = 0;

      let canBuy = spec.upgradeService.canBuyGlobalUpgrade('redox_bandwidth', spec.state.player);

      expect(canBuy).toBeFalsy();
    });

    it('should return true if an upgrade can be bought', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = 1e300;

      let canBuy = spec.upgradeService.canBuyGlobalUpgrade('redox_bandwidth', spec.state.player);

      expect(canBuy).toBeTruthy();
    });

    it('should buy an upgrade', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = 1e300;

      spec.upgradeService.buyGlobalUpgrade('redox_bandwidth', spec.state.player);

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(3);
    });

    it('should not buy an upgrade that it can\'t afford', function() {
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = 0;

      spec.upgradeService.buyGlobalUpgrade('redox_bandwidth', spec.state.player);

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(2);
    });
  });
});
