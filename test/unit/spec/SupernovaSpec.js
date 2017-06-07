/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Supernova ', function() {
  let spec = {};

  commonSpec(spec);

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources.xH = {number:110};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = false;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(10);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources.xH = {number:10};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = false;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(10);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources.xH = {number:110};
      spec.state.player.elements.H = {exotic_upgrades:{}};
      spec.state.player.elements.H.exotic_upgrades.x3 = true;

      spec.supernova.buyExoticUpgrade('x3','H');

      expect(spec.state.player.resources.xH.number).toEqual(110);
      expect(spec.state.player.elements.H.exotic_upgrades.x3).toEqual(true);
    });
  });
});
