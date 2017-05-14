/* globals describe,commonSpec,it,expect,spyOn, */
// jshint varstmt: false
'use strict';

describe('Element service', function() {
  var spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should calculate element price', function() {
      spec.state.player = {};
      spec.state.player.elements_unlocked = 1;

      var value = spec.element.elementPrice('O');

      expect(value).toEqual(16);
    });

    it('should calculate element price 2', function() {
      spec.state.player = {};
      spec.state.player.elements_unlocked = 5;

      var value = spec.element.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(1600,6);
    });

    it('should check if the cost of an element is met', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['e-'] = {number:0};
			spec.state.player.resources.p = {number:300};
			spec.state.player.resources.n = {number:300};

      var value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it('should check if the cost of an element is met 2', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['e-'] = {number:300};
			spec.state.player.resources.p = {number:0};
			spec.state.player.resources.n = {number:300};
      spec.state.player.elements_unlocked = 1;

      var value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it('should check if the cost of an element is met 3', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['e-'] = {number:300};
			spec.state.player.resources.p = {number:300};
			spec.state.player.resources.n = {number:0};
      spec.state.player.elements_unlocked = 1;

      var value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it('should check if the cost of an element is met 4', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['e-'] = {number:300};
			spec.state.player.resources.p = {number:300};
			spec.state.player.resources.n = {number:300};
      spec.state.player.elements_unlocked = 1;

      var value = spec.element.isElementCostMet('O');

      expect(value).toEqual(true);
    });
  });

  describe('purchase functions', function() {
    it('should purchase element if cost is met', function() {
      spec.state.player = {elements:{},resources:{},elements_unlocked:1};
      spec.state.player.resources['e-'] = {number:256};
      spec.state.player.resources.p = {number:257};
      spec.state.player.resources.n = {number:258};
      spec.state.player.elements.O = {unlocked:false,generators:{}};
      spec.state.player.elements.O.generators['Tier 1'] = 0;

      spec.element.buyElement('O');

      expect(spec.state.player.resources['e-'].number).toEqual(240);
      expect(spec.state.player.resources.p.number).toEqual(241);
      expect(spec.state.player.resources.n.number).toEqual(242);
      expect(spec.state.player.elements.O.unlocked).toEqual(true);
      expect(spec.state.player.elements.O.generators['Tier 1']).toEqual(1);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should not purchase element if cost is not met', function() {
      spec.state.player = {elements:{},resources:{},elements_unlocked:2};
      spec.state.player.resources['e-'] = {number:1};
      spec.state.player.resources.p = {number:20};
      spec.state.player.resources.n = {number:30};
      spec.state.player.elements.O = {unlocked:false,generators:{}};
      spec.state.player.elements.O.generators['Tier 1'] = 0;

      spec.element.buyElement('O');

      expect(spec.state.player.resources['e-'].number).toEqual(1);
      expect(spec.state.player.resources.p.number).toEqual(20);
      expect(spec.state.player.resources.n.number).toEqual(30);
      expect(spec.state.player.elements.O.unlocked).toEqual(false);
      expect(spec.state.player.elements.O.generators['Tier 1']).toEqual(0);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should skip if the element is already purchased', function() {
      spyOn(spec.element,'isElementCostMet');
      spec.state.player = {elements:{}};
      spec.state.player.elements.O = {unlocked:true};

      spec.element.buyElement('O');

      expect(spec.element.isElementCostMet).not.toHaveBeenCalled();
    });
  });
});
