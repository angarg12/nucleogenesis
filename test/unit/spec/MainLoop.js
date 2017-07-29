/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn, */
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
	  expect(spec.state.toast).toEqual([]);
	  expect(spec.state.isToastVisible).toEqual(false);
    });
  });

  describe('update', function() {
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
      expect(spec.state.player.resources['3He'].number).toEqual(0);
      expect(spec.state.player.resources['e-'].number).toEqual(0);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(0,4);
    });

    it('should process radioactivity 2', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.resources['3H'].unlocked = true;
      spec.state.player.resources['3H'].number = 1e+10;
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction = {};
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.reactant = {};
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.reactant['3H'] = 1;
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.product = {};
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.product['3He'] = 1;
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.product['e-'] = 1;
      spec.data.resources['3H'].decay.decay_types['beta-'].reaction.product.eV = 18610;
      spyOn(spec.util,'randomDraw').and.returnValue(18);

      spec.controller.update();

      expect(spec.state.player.resources['3H'].number).toEqual(9999999982);
      expect(spec.state.player.resources['3He'].number).toEqual(18);
      expect(spec.state.player.resources['e-'].number).toEqual(18);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(334980,4);
    });

    it('should process multi decay', function() {
      spec.state.player = spec.data.start_player;
      spec.state.player.resources['70Ga'].unlocked = true;
      spec.state.player.resources['70Ga'].number = 10;
      spec.data.resources['70Ga'].decay.decay_types['beta-'].ratio = 0.75;
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction = {};
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.reactant = {};
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.reactant['70Ga'] = 1;
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.product = {};
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.product['70Ge'] = 1;
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.product['e-'] = 1;
      spec.data.resources['70Ga'].decay.decay_types['beta-'].reaction.product.eV = 1000;

      spec.data.resources['70Ga'].decay.decay_types.electron_capture.ratio = 0.25;
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction = {};
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction.reactant = {};
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction.reactant['70Ga'] = 1;
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction.product = {};
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction.product['70Zn'] = 1;
      spec.data.resources['70Ga'].decay.decay_types.electron_capture.reaction.product.eV = 100;

      spyOn(spec.util,'randomDraw').and.returnValue(10);

      spec.controller.update();

      expect(spec.state.player.resources['70Ga'].number).toEqual(0);
      expect(spec.state.player.resources['70Ge'].number).toEqual(7);
      expect(spec.state.player.resources['70Zn'].number).toEqual(3);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(7300,4);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it('should ', function() {
      //value = spec.$scope.xxxxxx();

      //expect(value).toEqual('xxxxxx');
    });
  });
});
