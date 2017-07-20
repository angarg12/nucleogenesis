/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Void component', function() {
  let spec = {};

  commonSpec(spec);

  describe('prestige', function() {
    it('should produce prestige currency', function() {
        spec.state.player = spec.data.start_player;
        spec.state.player.resources.xH = {number:1e8, unlocked: true};
        spec.state.player.resources.xO = {number:1e8, unlocked: true};

        let production = spec.void.darkProduction();

        expect(production).toEqual(36);
    });

    it('should prestige', function() {
        spec.state.player = spec.data.start_player;
        spec.state.player.resources['1H'] = {number:1e8, unlocked: true};
        spec.state.player.elements.H.upgrades['1-1'] = true;
        spec.state.player.reactions['H.OH-H2O'].active = 10;
        spec.state.player.elements.H.generators['1'] = 99;
        spec.state.player.elements.H.generators['2'] = 99;
        spec.state.player.resources.xH = {number:1e8, unlocked: true};
        spec.state.player.elements.H.exotic_upgrades.x3 = true;

        spec.void.darkPrestige();

        expect(spec.state.player.elements.H.upgrades['1-1']).toBeFalsy();
        expect(spec.state.player.elements.H.exotic_upgrades.x3).toBeFalsy();
        expect(spec.state.player.reactions['H.OH-H2O'].active).toEqual(0);
        expect(spec.state.player.elements.H.generators['1']).toEqual(1);
        expect(spec.state.player.elements.H.generators['2']).toEqual(0);
        expect(spec.state.player.resources['1H'].number).toEqual(0);
        expect(spec.state.player.resources.xH.number).toEqual(0);
        expect(spec.state.player.resources.dark_matter.number).toEqual(18);
    });
  });

  describe('purchase functions', function() {
    it('should purchase an upgrade if cost is met', function() {
      spec.state.player = {resources:{}, dark_upgrades:{}};
      spec.state.player.resources.dark_matter = {number:110};
      spec.state.player.dark_upgrades.table = false;

      spec.void.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(10);
      expect(spec.state.player.dark_upgrades.table).toEqual(true);
    });

    it('should not purchase an upgrade if cost is not met', function() {
      spec.state.player = {resources:{}, dark_upgrades:{}};
      spec.state.player.resources.dark_matter = {number:10};
      spec.state.player.dark_upgrades.table = false;

      spec.void.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(10);
      expect(spec.state.player.dark_upgrades.table).toEqual(false);
    });

    it('should skip if the upgrade is already bought', function() {
      spec.state.player = {resources:{}, dark_upgrades:{}};
      spec.state.player.resources.dark_matter = {number:110};
      spec.state.player.dark_upgrades.table = true;

      spec.void.buyDarkUpgrade('table');

      expect(spec.state.player.resources.dark_matter.number).toEqual(110);
      expect(spec.state.player.dark_upgrades.table).toEqual(true);
    });
  });

  describe('visibility functions', function() {
      it('should show if a dark upgrade is visible', function() {
        spec.state.player = spec.data.start_player;
        let temp = spec.data.dark_upgrades;
        spec.data.dark_upgrades = {};
        spec.data.dark_upgrades.table = temp.table;

        let values = spec.void.visibleDarkUpgrades('H');

        expect(values).toEqual(['table']);
      });
  });
});
