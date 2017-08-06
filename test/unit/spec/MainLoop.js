/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,spyOn, */
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
      }
    };
    spec.state.player.resources = {
      '16O': {
        unlocked: false,
        number: 0
      },
      '17O': {
        unlocked: false,
        number: 0
      },
      '18O': {
        unlocked: false,
        number: 0
      }
    };
  });

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
      let copy = angular.copy(spec.state.player);

      spec.controller.update();

      expect(spec.state.player).toEqual(copy);
    });

    it('should generate isotopes', function() {
      spec.state.player.elements.O = {
        unlocked: true
      };
      spyOn(spec.matter,'elementProduction').and.returnValue(200);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(200);
      expect(spec.state.player.resources['17O'].number).toEqual(0);
      expect(spec.state.player.resources['18O'].number).toEqual(0);
    });

    it('should generate isotopes 2', function() {
      spec.state.player.elements.O = {
        unlocked: true
      };
      spyOn(spec.matter,'elementProduction').and.returnValue(1200);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(1198);
      expect(spec.state.player.resources['17O'].number).toEqual(0);
      expect(spec.state.player.resources['18O'].number).toEqual(2);
    });

    it('should generate isotopes 3', function() {
      spec.state.player.elements.O = {
        unlocked: true
      };
      spyOn(spec.matter,'elementProduction').and.returnValue(32000);

      spec.controller.update();

      expect(spec.state.player.resources['16O'].number).toEqual(31924);
      expect(spec.state.player.resources['17O'].number).toEqual(12);
      expect(spec.state.player.resources['18O'].number).toEqual(64);
    });

    it('should process radioactivity', function() {
      spec.data.radioisotopes = ['3H'];
      spec.data.elements = {
        H: {
          isotopes: {
            '3H':{
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
              }
            }
          }
        }
      };
      spec.data.resources['3H'] = {
        elements: {'H':1}
      };
      spec.state.player.resources['3H'] = {
        unlocked: true,
        number: 1e+10
      };
      spec.state.player.resources['3He'] = {
        unlocked: true,
        number: 0
      };
      spec.state.player.resources['e-'] = {
        unlocked: true,
        number: 0
      };
      spec.state.player.resources.eV = {
        unlocked: true,
        number: 0
      };

      spec.controller.update();

      expect(spec.state.player.resources['3H'].number).toEqual(9999999983);
      expect(spec.state.player.resources['3He'].number).toEqual(17);
      expect(spec.state.player.resources['e-'].number).toEqual(17);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(316047,4);
    });

    it('should process multi decay', function() {
      spec.data.radioisotopes = ['70Ga'];
      spec.data.elements = {
        Ga: {
          isotopes: {
            '70Ga':{
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
              }
            }
          }
        }
      };
      spec.data.resources['70Ga'] = {
        elements: {Ga:1}
      };
      spec.state.player.resources = {
        '70Ga': {
          unlocked: true,
          number: 100
        },
        '70Ge': {
          unlocked: false,
          number: 0
        },
        '70Zn': {
          unlocked: false,
          number: 0
        },
        'e-': {
          unlocked: false,
          number: 0
        },
        eV: {
          unlocked: false,
          number: 0
        }
      };

      spec.controller.update();

      expect(spec.state.player.resources['70Ga'].number).toEqual(71);
      expect(spec.state.player.resources['70Ge'].number).toEqual(22);
      expect(spec.state.player.resources['70Zn'].number).toEqual(7);
      expect(spec.state.player.resources['e-'].number).toEqual(22);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(22700,4);
    });
  });
});
