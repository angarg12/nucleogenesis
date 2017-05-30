/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach,spyOn, */
/* jshint varstmt: false */
'use strict';

describe('controller main-loop', function() {
  let spec = {};

  commonSpec(spec);

  describe('initialization functions', function() {
    it('should init all the variables', function() {
    spec.state.init();

	  expect(spec.state.currentElement).toEqual('H');
	  expect(spec.state.hoverElement).toEqual('');
	  expect(spec.achievement.toast).toEqual([]);
	  expect(spec.achievement.isToastVisible).toEqual(false);
    });
  });

  describe('onload', function() {
    beforeEach(function() {
			spyOn(spec.savegame, 'load');
			spyOn(spec.state, 'init');
    });

    it('should load the game', function() {
      // flush onload
      spec.$timeout.flush();

      expect(spec.savegame.load).toHaveBeenCalled();
    });

    it('should load the player', function() {
      spyOn(localStorage, 'getItem').and.returnValue('');

      // flush onload
      spec.$timeout.flush();

			expect(spec.savegame.load).toHaveBeenCalled();
    });

    it('should not init if the player exists', function() {
      spec.state.player = '';

      // flush onload
      spec.$timeout.flush();

			expect(spec.state.init).not.toHaveBeenCalled();
    });
  });

  describe('update', function() {
    beforeEach(function() {
      spyOn(spec.achievement, 'checkAchievements');
    });

    it('should not update player if nothing is purchased', function() {
      spec.state.player = angular.copy(spec.data.start_player);

      spec.controller.update();

      expect(spec.state.player).toEqual(spec.data.start_player);
    });

    it('should generate isotopes', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.elements.O.unlocked = true;
      spec.state.player.elements.O.generators['1'] = 200;
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValue(0);
      spyOn(spec.util.poisson,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(200);
      expect(spec.state.player.resources['17O'].number).toEqual(0);
      expect(spec.state.player.resources['18O'].number).toEqual(0);
    });

    it('should generate isotopes 2', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.elements.O.unlocked = true;
      spec.state.player.elements.O.generators['1'] = 1200;
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValue(0);
      spyOn(spec.util.poisson,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(1197);
      expect(spec.state.player.resources['17O'].number).toEqual(0);
      expect(spec.state.player.resources['18O'].number).toEqual(3);
    });

    it('should generate isotopes 3', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.elements.O.unlocked = true;
      spec.state.player.elements.O.generators['1'] = 32000;
      spyOn(spec.util.gaussian,'nextGaussian').and.returnValue(0);
      spyOn(spec.util.poisson,'getPoisson').and.returnValue(0);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(31923);
      expect(spec.state.player.resources['17O'].number).toEqual(13);
      expect(spec.state.player.resources['18O'].number).toEqual(64);
    });

    it('should process radioactivity', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.resources['3H'].unlocked = true;
      spec.state.player.resources['3H'].number = 1000;
      spyOn(spec.util,'randomDraw').and.returnValue(0);

      spec.controller.update();

      expect(spec.state.player.resources['3H'].number).toEqual(1000);
      expect(spec.state.player.resources['3He+'].number).toEqual(0);
      expect(spec.state.player.resources['e-'].number).toEqual(0);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(0,4);
    });

    it('should process radioactivity 2', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.resources['3H'].unlocked = true;
      spec.state.player.resources['3H'].number = 1e+10;
      spyOn(spec.util,'randomDraw').and.returnValue(18);

      spec.controller.update();

      expect(spec.state.player.resources['3H'].number).toEqual(9999999982);
      expect(spec.state.player.resources['3He+'].number).toEqual(18);
      expect(spec.state.player.resources['e-'].number).toEqual(18);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(334980,4);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it('should ', function() {
      //value = spec.$scope.xxxxxx();

      //expect(value).toEqual('xxxxxx');
    });
  });
});
