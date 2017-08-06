/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn, */
/* jshint varstmt: false */
'use strict';

describe('Core component', function() {
  let spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should calculate element price', function() {
      spec.data.constants.ELEMENT_PRICE_INCREASE = 2;
      spec.data.elements.O = {number: 8};
      spec.state.player = {};
      spec.state.player.elements_unlocked = 1;

      let value = spec.core.elementPrice('O');

      expect(value).toEqual(16);
    });

    it('should calculate element price 2', function() {
      spec.data.constants.ELEMENT_PRICE_INCREASE = 2;
      spec.data.elements.Sn = {number: 50};
      spec.state.player = {};
      spec.state.player.elements_unlocked = 5;

      let value = spec.core.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(1600,6);
    });
  });

  describe('purchase functions', function() {
    it('should purchase element if cost is met', function() {
      spec.data.constants.ELEMENT_PRICE_INCREASE = 2;
      spec.data.elements.O = {number: 8};
      spec.state.player = {elements:{},resources:{},elements_unlocked:1};
      spec.state.player.resources.dark_matter = {number:256};
      spec.state.player.elements.O = {unlocked:false,generators:{}};
      spec.state.player.elements.O.generators['1'] = 0;

      spec.core.buyElement('O');

      expect(spec.state.player.resources.dark_matter.number).toEqual(240);
      expect(spec.state.player.elements.O.unlocked).toEqual(true);
      expect(spec.state.player.elements.O.generators['1']).toEqual(1);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should not purchase element if cost is not met', function() {
      spec.data.constants.ELEMENT_PRICE_INCREASE = 2;
      spec.data.elements.O = {number: 8};
      spec.state.player = {elements:{},resources:{},elements_unlocked:2};
      spec.state.player.resources.dark_matter = {number:1};
      spec.state.player.elements.O = {unlocked:false,generators:{}};
      spec.state.player.elements.O.generators['1'] = 0;

      spec.core.buyElement('O');

      expect(spec.state.player.resources.dark_matter.number).toEqual(1);
      expect(spec.state.player.elements.O.unlocked).toEqual(false);
      expect(spec.state.player.elements.O.generators['1']).toEqual(0);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should skip if the element is already purchased', function() {
      spec.state.player = {elements:{}};
      spec.data.elements.O = {number: 8};
      spec.state.player.elements.O = {unlocked:true};

      spec.core.buyElement('O');

      expect(spec.state.player.elements.O.unlocked).toEqual(true);
    });
  });

  describe('class functions', function() {
    it('should return the right class for unavailable elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};

      let clazz = spec.core.elementClass('H');

      expect(clazz).toEqual('element_unavailable');
    });

    it('should return the right class for purchased elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = {unlocked: true};

      let clazz = spec.core.elementClass('H');

      expect(clazz).toEqual('element_purchased');
    });

    it('should return the right class for elements where the cost is met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = {unlocked: false};
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = {number: 1e6};
      spyOn(spec.core, 'elementPrice').and.returnValue(100);

      let clazz = spec.core.elementClass('H');

      expect(clazz).toEqual('element_cost_met');
    });

    it('should return the right class for elements where the cost is not met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = {unlocked: false};
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = {number: 0};
      spyOn(spec.core, 'elementPrice').and.returnValue(100);

      let clazz = spec.core.elementClass('H');

      expect(clazz).toEqual('element_cost_not_met');
    });

    it('should return the right secondary class', function() {
      spec.data.elements.H = {};
      spyOn(spec.core, 'elementClass').and.returnValue('available');

      let clazz = spec.core.elementSecondaryClass('H');

      expect(clazz).toEqual('available_dark');
    });
  });
});
