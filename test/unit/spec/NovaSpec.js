/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Nova ', function() {
  let spec = {};

  commonSpec(spec);

  describe('purchase functions', function() {
    it('should return false if an upgrade can\'t be bought', function() {
      spec.state.player = {resources:{}, global_upgrades:{}};
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = {number:0};

      let canBuy = spec.nova.canBuyGlobalUpgrade('redox_bandwidth');

      expect(canBuy).toBeFalsy();
    });

    it('should return true if an upgrade can be bought', function() {
      spec.state.player = {resources:{}, global_upgrades:{}};
      spec.state.player.global_upgrades.redox_bandwidth = 0;
      spec.state.player.resources.eV = {number:1e300};

      let canBuy = spec.nova.canBuyGlobalUpgrade('redox_bandwidth');

      expect(canBuy).toBeTruthy();
    });

    it('should buy an upgrade', function() {
      spec.state.player = {resources:{}, global_upgrades:{}};
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = {number:1e300};

      spec.nova.buyGlobalUpgrade('redox_bandwidth');

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(3);
    });

    it('should not buy an upgrade that it can\'t afford', function() {
      spec.state.player = {resources:{}, global_upgrades:{}};
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.resources.eV = {number:0};

      spec.nova.buyGlobalUpgrade('redox_bandwidth');

      expect(spec.state.player.global_upgrades.redox_bandwidth).toEqual(2);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:110};
      spec.state.player.elements.H = {upgrades:{}};
      spec.state.player.elements.H.upgrades['1-1'] = false;

      spec.nova.buyUpgrade('1-1','H');

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.elements.H.upgrades['1-1']).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = {upgrades:{}};
      spec.state.player.elements.H.upgrades['1-1'] = false;

      spec.nova.buyUpgrade('1-1','H');

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.elements.H.upgrades['1-1']).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = {upgrades:{}};
      spec.state.player.elements.H.upgrades['1-1'] = true;

      spec.nova.buyUpgrade('1-1','H');

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.elements.H.upgrades['1-1']).toEqual(true);
    });
  });
});
