/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Nova ', function() {
  var spec = {};

  commonSpec(spec);

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
