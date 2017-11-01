/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn, */
/* jshint varstmt: false */
'use strict';

describe('Elements component', function() {
  let spec = {};

  commonSpec(spec);

  describe('purchase functions', function() {
    it('should not purchase element if roll is failed', function() {
      spec.data.elements.O = {abundance: 0.5};
      spec.state.player = {elements:{},resources:{},elements_unlocked:1};
      spec.state.player.resources.dark_matter = {number:1};
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.7);

      spec.elements.buyElement('O');

      expect(spec.state.player.resources.dark_matter.number).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(false);
      expect(spec.state.player.elements_unlocked).toEqual(1);
    });

    it('should purchase element if roll is successful', function() {
      spec.data.elements.O = {abundance: 0.5};
      spec.state.player = {elements:{},exotic_upgrades:{},resources:{},elements_unlocked:1};
      spec.state.player.resources.dark_matter = {number:1};
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.2);

      spec.elements.buyElement('O');

      expect(spec.state.player.resources.dark_matter.number).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should not purchase element if cost is not met', function() {
      spec.data.elements.O = {abundance: 1};
      spec.state.player = {elements:{},resources:{},elements_unlocked:2};
      spec.state.player.resources.dark_matter = {number:0};
      spec.state.player.elements.O = false;

      spec.elements.buyElement('O');

      expect(spec.state.player.resources.dark_matter.number).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(false);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should skip if the element is already purchased', function() {
      spec.state.player = {elements:{}};
      spec.data.elements.O = {number: 8};
      spec.state.player.elements.O = true;

      spec.elements.buyElement('O');

      expect(spec.state.player.elements.O).toEqual(true);
    });
  });
  describe('element select', function() {
    it('should select an element for the index', function() {		
      spec.data.element_slot = {
        upgrades: {
          '1-1': false
        },
        generators: {
          '1': 0,
          '2': 0
        },
        reactions: [],
        redoxes: []
      };
	  spec.data.generators['1'] = {
        price: 10,
        price_exp: 1.12,
        power: 1
      };

      spec.elementSelect.selectElement('H', 0);

      expect(spec.state.player.element_slots[0]).toEqual({
        element: 'H',
		upgrades: {
          '1-1': false
        },
        generators: {
          '1': 1,
          '2': 0
        },
        reactions: [],
        redoxes: []
      });
    }); 
  });
/*
  describe('class functions', function() {
    it('should return the right class for unavailable elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};

      let clazz = spec.elements.elementClass('H');

      expect(clazz).toEqual('element_unavailable');
    });

    it('should return the right class for purchased elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = true;

      let clazz = spec.elements.elementClass('H');

      expect(clazz).toEqual('element_purchased');
    });

    it('should return the right class for elements where the cost is met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = false;
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = {number: 1};

      let clazz = spec.elements.elementClass('H');

      expect(clazz).toEqual('element_cost_met');
    });

    it('should return the right class for elements where the cost is not met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = false;
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = {number: 0};

      let clazz = spec.elements.elementClass('H');

      expect(clazz).toEqual('element_cost_not_met');
    });

    it('should return the right secondary class', function() {
      spec.data.elements.H = {};
      spyOn(spec.elements, 'elementClass').and.returnValue('available');

      let clazz = spec.elements.elementSecondaryClass('H');

      expect(clazz).toEqual('available_dark');
    });
  });
  */
});
