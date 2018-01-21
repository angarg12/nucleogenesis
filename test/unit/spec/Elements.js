/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn, */
/* jshint varstmt: false */
'use strict';

describe('Elements component', function() {
  let spec = {};

  commonSpec(spec);

  describe('purchase functions', function() {
    it('should not purchase element if roll is failed', function() {
      spec.state.player.options.elementBuyIndex = 0;
      spec.data.elements.O = {abundance: 0.5, includes: []};
      spec.state.player.elements_unlocked = 1;
      spec.state.player.resources.dark_matter = 1;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.7);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(false);
      expect(spec.state.player.elements_unlocked).toEqual(1);
    });

    it('should purchase element if roll is successful', function() {
      spec.state.player.options.elementBuyIndex = 0;
      spec.data.elements.O = {abundance: 0.5, includes: []};
      spec.state.player.elements_unlocked = 1;
      spec.state.player.resources.dark_matter = 1;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.2);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should not purchase element if cost is not met', function() {
      spec.state.player.options.elementBuyIndex = 0;
      spec.data.elements.O = {abundance: 1, includes: []};
      spec.state.player.elements_unlocked = 2;
      spec.state.player.resources.dark_matter = 0;
      spec.state.player.elements.O = false;

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(false);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should spend purchase amount', function() {
      spec.data.elements.O = {abundance: 0.5, includes: []};
      spec.elements.buyAmount = [5];
      spec.state.player.options.elementBuyIndex = 0;
      spec.state.player.elements_unlocked = 1;
      spec.state.player.resources.dark_matter = 10;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.2);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(5);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should not spend more than purchase amount', function() {
      spec.data.elements.O = {abundance: 0.5, includes: []};
      spec.elements.buyAmount = [25];
      spec.state.player.options.elementBuyIndex = 0;
      spec.state.player.elements_unlocked = 1;
      spec.state.player.resources.dark_matter = 10;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.2);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('purchase amount should increase chance of success', function() {
      spec.data.elements.O = {abundance: 0.1, includes: []};
      spec.elements.buyAmount = [5];
      spec.state.player.options.elementBuyIndex = 0;
      spec.state.player.elements_unlocked = 1;
      spec.state.player.resources.dark_matter = 10;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.3);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(5);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('resources of the target element should increase chance of success', function() {
      spec.data.constants.ELEMENT_CHANCE_BONUS = 0.01;
      spec.data.elements.O = {abundance: 0.1, includes: ['16O']};
      spec.elements.buyAmount = [1];
      spec.state.player.options.elementBuyIndex = 0;
      spec.state.player.elements_unlocked = 1;
      spec.state.player.statistics.all_time['16O'] = 300;
      spec.state.player.resources.dark_matter = 1;
      spec.state.player.elements.O = false;

      spyOn(Math, 'random').and.returnValue(0.3);

      spec.elements.buyElement('O', spec.state.player);

      expect(spec.state.player.resources.dark_matter).toEqual(0);
      expect(spec.state.player.elements.O).toEqual(true);
      expect(spec.state.player.elements_unlocked).toEqual(2);
    });

    it('should skip if the element is already purchased', function() {
      spec.data.elements.O = 8;
      spec.state.player.elements.O = true;

      spec.elements.buyElement('O', spec.state.player);

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

      spec.elementSelect.selectElement('H', 0, spec.state.player);

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

    it('should restore caches', function() {
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
      spec.state.reactionsCache.H = {a:1};
      spec.state.redoxesCache.H = {b:1};

      spec.elementSelect.selectElement('H', 0, spec.state.player);

      expect(spec.state.player.element_slots[0].reactions).toEqual({a:1});
      expect(spec.state.player.element_slots[0].redoxes).toEqual({b:1});
    });

    it('should check if an element is selected', function() {
      spec.state.player.element_slots = [{element:'H'}];

      let result = spec.elementSelect.isElementSelected ('H', spec.state.player);

      expect(result).toEqual(true);
    });

    it('should check if an element is not selected', function() {
      spec.state.player.element_slots = [{element:'H'}];

      let result = spec.elementSelect.isElementSelected ('O', spec.state.player);

      expect(result).toEqual(false);
    });
  });
/*
  describe('class functions', function() {
    it('should return the right class for unavailable elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};

      let clazz = spec.elements.elementClass('H', spec.state.player);

      expect(clazz).toEqual('element_unavailable');
    });

    it('should return the right class for purchased elements', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = true;

      let clazz = spec.elements.elementClass('H', spec.state.player);

      expect(clazz).toEqual('element_purchased');
    });

    it('should return the right class for elements where the cost is met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = false;
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = 1;

      let clazz = spec.elements.elementClass('H', spec.state.player);

      expect(clazz).toEqual('element_cost_met');
    });

    it('should return the right class for elements where the cost is not met', function() {
      spec.data.elements.H = {};
      spec.state.player.elements = {};
      spec.state.player.elements.H = false;
      spec.state.player.resources = {};
      spec.state.player.resources.dark_matter = 0;

      let clazz = spec.elements.elementClass('H', spec.state.player);

      expect(clazz).toEqual('element_cost_not_met');
    });

    it('should return the right secondary class', function() {
      spec.data.elements.H = {};
      spyOn(spec.elements, 'elementClass').and.returnValue('available');

      let clazz = spec.elements.elementSecondaryClass('H', spec.state.player);

      expect(clazz).toEqual('available_dark');
    });
  });
  */
});
