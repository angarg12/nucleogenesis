/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('MainLoop', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.elements.O = {
      'main': '16O',
      'isotopes': {
        '16O': {
          'ratio': 0.9976,
          'energy': 14899160838
        },
        '17O': {
          'ratio': 0.00039,
          'energy': 15834582639
        },
        '18O': {
          'ratio': 0.00201,
          'energy': 16766103545
        }
      },
      'electronegativity': 0
    };
    spec.state.player.resources = {
      '16O': null,
      '17O': null,
      '18O': null
    };
  });

  describe('initialization functions', function() {
    it('should init all the variables', function() {
    spec.state.init();

	  expect(spec.state.hoverElement).toEqual('');
	  expect(spec.state.toast).toEqual([]);
	  expect(spec.state.isToastVisible).toEqual(false);
    });
  });

  describe('update', function() {
    it('should not update player if nothing is purchased', function() {
      let copy = angular.copy(spec.state.player);

      spec.controller.update();

      expect(spec.state.player).toEqual(copy);
    });

    it('should generate isotopes', function() {
      spec.state.player.elements.O = true;
      spyOn(spec.generators,'elementProduction').and.returnValue(200);
      spyOn(Math,'random').and.returnValue(1);
      spec.state.player.element_slots = [{
        element: 'O',
        reactions: [],
        redoxes: []
      }];

      spec.controller.update();

      expect(spec.state.player.resources['16O']).toEqual(200);
      expect(spec.state.player.resources['17O']).toEqual(null);
      expect(spec.state.player.resources['18O']).toEqual(null);
      expect(spec.state.player.statistics.exotic_run.O['16O']).toEqual(200);
      expect(spec.state.player.statistics.dark_run['16O']).toEqual(200);
      expect(spec.state.player.statistics.all_time['16O']).toEqual(200);
    });

    it('should generate isotopes 2', function() {
      spec.state.player.elements.O = true;
      spyOn(spec.generators,'elementProduction').and.returnValue(1200);
      spyOn(Math,'random').and.returnValue(1);
      spec.state.player.element_slots = [{
        element: 'O',
        reactions: [],
        redoxes: []
      }];

      spec.controller.update();

      expect(spec.state.player.resources['16O']).toEqual(1198);
      expect(spec.state.player.resources['17O']).toEqual(null);
      expect(spec.state.player.resources['18O']).toEqual(2);
      expect(spec.state.player.statistics.exotic_run.O['16O']).toEqual(1198);
      expect(spec.state.player.statistics.dark_run['16O']).toEqual(1198);
      expect(spec.state.player.statistics.all_time['16O']).toEqual(1198);
    });

    it('should generate isotopes 3', function() {
      spec.state.player.elements.O = true;
      spyOn(spec.generators,'elementProduction').and.returnValue(32000);
      spyOn(Math,'random').and.returnValue(1);
      spec.state.player.element_slots = [{
        element: 'O',
        reactions: [],
        redoxes: []
      }];

      spec.controller.update();

      expect(spec.state.player.resources['16O']).toEqual(31924);
      expect(spec.state.player.resources['17O']).toEqual(12);
      expect(spec.state.player.resources['18O']).toEqual(64);
      expect(spec.state.player.statistics.exotic_run.O['16O']).toEqual(31924);
      expect(spec.state.player.statistics.dark_run['16O']).toEqual(31924);
      expect(spec.state.player.statistics.all_time['16O']).toEqual(31924);
    });

    it('should generate isotopes with very low probability', function() {
      spec.state.player.elements.O = true;
      spyOn(spec.generators,'elementProduction').and.returnValue(100);
      spyOn(Math,'random').and.returnValue(0);
      spec.state.player.element_slots = [{
        element: 'O',
        reactions: [],
        redoxes: []
      }];

      spec.controller.update();

      expect(spec.state.player.resources['16O']).toEqual(99);
      expect(spec.state.player.resources['17O']).toEqual(1);
      expect(spec.state.player.resources['18O']).toEqual(1);
    });

    it('should generate isotopes with very low probability', function() {
      spec.state.player.elements.O = true;
      spyOn(spec.generators,'elementProduction').and.returnValue(100);
      spyOn(Math,'random').and.returnValue(0.1);
      spec.state.player.element_slots = [{
        element: 'O',
        reactions: [],
        redoxes: []
      }];

      spec.controller.update();

      expect(spec.state.player.resources['16O']).toEqual(99);
      expect(spec.state.player.resources['17O']).toEqual(null);
      expect(spec.state.player.resources['18O']).toEqual(1);
    });

    it('should process radioactivity', function() {
      spec.data.radioisotopes = ['3H'];
      spec.data.resources['3H'] = {
        decay: {
          half_life: 388520000,
          decay_types: {
            'beta-': {
              ratio: 1,
              reaction: {
                reactant: {
                  '3H': 1
                },
                product: {
                  '3He': 1,
                  'e-': 1,
                  eV: 18591
                }
              }
            }
          }
        },
        elements: {'H':1}
      };
      spec.state.player.resources['3H'] = 1e+10;
      spec.state.player.resources['3He'] = 0;
      spec.state.player.resources['e-'] = 0;
      spec.state.player.resources.eV = 0;

      spec.controller.update();

      expect(spec.state.player.resources['3H']).toEqual(9999999983);
      expect(spec.state.player.resources['3He']).toEqual(17);
      expect(spec.state.player.resources['e-']).toEqual(17);
      expect(spec.state.player.resources.eV).toBeCloseTo(316047,4);
    });

    it('should process multi decay', function() {
      spec.data.radioisotopes = ['70Ga'];
      spec.data.resources['70Ga'] = {
        decay: {
          half_life: 2,
          decay_types: {
            'beta-': {
              ratio: 0.75,
              reaction: {
                reactant: {
                  '70Ga': 1
                },
                product: {
                  '70Ge': 1,
                  'e-': 1,
                  eV: 1000
                }
              }
            },
            electron_capture: {
              ratio: 0.25,
              reaction: {
                reactant: {
                  '70Ga': 1
                },
                product: {
                  '70Zn': 1,
                  eV: 100
                }
              }
            }
          }
        },
        elements: {Ga:1}
      };
      spec.state.player.resources = {
        '70Ga': 100,
        '70Ge': null,
        '70Zn': null,
        'e-': null,
        eV: null
      };

      spec.controller.update();

      expect(spec.state.player.resources['70Ga']).toEqual(66);
      expect(spec.state.player.resources['70Ge']).toEqual(26);
      expect(spec.state.player.resources['70Zn']).toEqual(8);
      expect(spec.state.player.resources['e-']).toEqual(26);
      expect(spec.state.player.resources.eV).toBeCloseTo(26800,4);
    });

    it('should process very high half-lifes', function() {
      spec.data.radioisotopes = ['3H'];
      spec.data.resources['3H'] = {
        decay: {
          half_life: 1e30,
          decay_types: {
            'beta-': {
              ratio: 1,
              reaction: {
                reactant: {
                  '3H': 1
                },
                product: {
                  '3He': 1
                }
              }
            }
          }
        },
        elements: {'H':1}
      };
      spec.state.player.resources['3H'] = 1e+60;
      spec.state.player.resources['3He'] = 0;

      spec.controller.update();

      expect(spec.state.player.resources['3H']).toBeCloseTo(1e+60,4);
      // we have to do this since toBeCloseTo fails
      expect(spec.state.player.resources['3He']).toBeGreaterThan(6.9e+29);
      expect(spec.state.player.resources['3He']).toBeLessThan(7e+29);
    });
  });
});
