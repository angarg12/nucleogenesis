/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach, spyOn */
/* jshint varstmt: false */
'use strict';

describe('Generators component', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
      spec.data.generators['1'] = {
        price: 10,
        price_exp: 1.12,
        power: 1
      };
      spec.state.player.element_slots = [{
        element: 'H',
        generators: {}
      }];
  });

  describe('purchase', function() {
    it('should return the price of a generator', function() {
      spec.state.player.element_slots[0].generators = {'1': 5};

      let value = spec.generators.generatorTotalPrice(spec.state.player, '1',spec.state.player.element_slots[0], 1);

      expect(value).toEqual(18);
    });

    it('should return the price of a generator 2', function() {
      spec.data.generators['6'] = {
        price: 1e6,
        price_exp: 1.14
      };
      spec.state.player.element_slots[0].generators = {'6': 10};

      let value = spec.generators.generatorTotalPrice(spec.state.player, '6',spec.state.player.element_slots[0], 1);

      expect(value).toEqual(3707222);
    });

    it('should return the price of a generator 3', function() {
      spec.state.player.element_slots[0].generators = {'1': 1};

      let value = spec.generators.generatorTotalPrice(spec.state.player, '1',spec.state.player.element_slots[0], 10);

      expect(value).toEqual(202);
    });

    it('should return the price of a generator 4', function() {
      spec.state.player.element_slots[0].generators = {'1': 10};

      let value = spec.generators.generatorTotalPrice(spec.state.player, '1',spec.state.player.element_slots[0], 100);

      expect(value).toEqual(21617082);
    });

    it('should return the price of a generator 5', function() {
      spec.state.player.element_slots[0].generators = {'1': 10};
      spyOn(spec.generators, 'maxCanBuy');

      spec.generators.generatorTotalPrice(spec.state.player, '1',spec.state.player.element_slots[0], 'max');

      expect(spec.generators.maxCanBuy).toHaveBeenCalled();
    });

    it('should purchase as many generators as requested', function() {
      spec.state.player.element_slots[0].generators = {'1': 5};
      spec.state.player.resources['1H'] = 65;
      spec.data.elements = {
        H: {
          main: '1H'
        }
      };

      spec.generators.buyGenerators(spec.state.player, '1',spec.state.player.element_slots[0],3);

      expect(spec.state.player.resources['1H']).toEqual(4);
      expect(spec.state.player.element_slots[0].generators['1']).toEqual(8);
    });

    it('should purchase as many generators as possible', function() {
      spec.state.player.element_slots[0].generators = {'1': 5};
      spec.state.player.resources['1H'] = 45;
      spec.data.elements = {
        H: {
          main: '1H'
        }
      };

      spec.generators.buyGenerators(spec.state.player, '1',spec.state.player.element_slots[0],'max');

      expect(spec.state.player.resources['1H']).toEqual(7);
      expect(spec.state.player.element_slots[0].generators['1']).toEqual(7);
    });

    it('should not purchase generator if cost is not met', function() {
      spec.state.player.element_slots[0].generators = {'1': 5};
      spec.state.player.resources['1H'] = 10;
      spec.data.elements = {
        H: {
          main: '1H'
        }
      };

      spec.generators.buyGenerators(spec.state.player, '1',spec.state.player.element_slots[0],10);

      expect(spec.state.player.resources['1H']).toEqual(10);
      expect(spec.state.player.element_slots[0].generators['1']).toEqual(5);
    });
  });

  describe('production functions', function() {
    it('should calculate the generator production', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      spec.data.elements.H = {
        exotic: 'xH'
      };
      spec.data.upgrades = {
        '1-1': {
          tiers: ['1'],
          function: 'two',
          tags: ['production', '1']
        },
        '1-2': {
          tiers: ['1'],
          function: 'three',
          tags: ['production', '1']
        },
        '1-3': {
          tiers: ['1'],
          function: 'four',
          tags: ['production', '1']
        }
      };
      spec.upgradeService.two = function(args) {args.production*=2;};
      spec.upgradeService.three = function(args) {args.production*=3;};
      spec.upgradeService.four = function(args) {args.production*=4;};
      spec.state.player.resources.xH = 0;
      spec.state.player.resources.dark_matter = 0;
      spec.state.player.element_slots[0].generators = {'1': 1};
      spec.state.player.element_slots[0].upgrades = {
        '1-1': true,
        '1-2': true,
        '1-3': false
      };

      let value = spec.generators.generatorProduction(spec.state.player, '1', spec.state.player.element_slots[0]);

      expect(value).toEqual(6);
    });

    it('should calculate the generator production with exotic matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      spec.data.elements.H = {
        exotic: 'xH'
      };
      spec.data.upgrades = {
        '1-1': {
          tiers: ['1'],
          function: 'two',
          tags: ['production', '1']
        },
        '1-2': {
          tiers: ['1'],
          function: 'three',
          tags: ['production', '1']
        },
        '1-3': {
          tiers: ['1'],
          function: 'four',
          tags: ['production', '1']
        }
      };
      spec.upgradeService.two = function(args) {args.production*=2;};
      spec.upgradeService.three = function(args) {args.production*=3;};
      spec.upgradeService.four = function(args) {args.production*=4;};
      spec.state.player.resources.xH = 3250;
      spec.state.player.resources.dark_matter = 0;
      spec.state.player.element_slots[0].upgrades = {
        '1-1': true,
        '1-2': true,
        '1-3': false
      };
      spec.state.player.element_slots[0].generators = {'1': 1};

      let value = spec.generators.generatorProduction(spec.state.player, '1',spec.state.player.element_slots[0]);

      expect(value).toEqual(25);
    });

    it('should calculate the generator production with dark matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      spec.data.elements.H = {
        exotic: 'xH'
      };
      spec.data.upgrades = {
        '1-1': {
          tiers: ['1'],
          function: 'two',
          tags: ['production', '1']
        },
        '1-2': {
          tiers: ['1'],
          function: 'three',
          tags: ['production', '1']
        },
        '1-3': {
          tiers: ['1'],
          function: 'four',
          tags: ['production', '1']
        }
      };
      spec.upgradeService.two = function(args) {args.production*=2;};
      spec.upgradeService.three = function(args) {args.production*=3;};
      spec.upgradeService.four = function(args) {args.production*=4;};
      spec.state.player.resources.xH = 0;
      spec.state.player.resources.dark_matter = 3250;
      spec.state.player.element_slots[0].upgrades = {
        '1-1': true,
        '1-2': true,
        '1-3': false
      };

      let value = spec.generators.generatorProduction(spec.state.player, '1',spec.state.player.element_slots[0]);

      expect(value).toEqual(201);
    });

    it('should calculate the generator production with exotic and dark matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      spec.data.elements.H = {
        exotic: 'xH'
      };
      spec.data.upgrades = {
        '1-1': {
          tiers: ['1'],
          function: 'two',
          tags: ['production', '1']
        },
        '1-2': {
          tiers: ['1'],
          function: 'three',
          tags: ['production', '1']
        },
        '1-3': {
          tiers: ['1'],
          function: 'four',
          tags: ['production', '1']
        }
      };
      spec.upgradeService.two = function(args) {args.production*=2;};
      spec.upgradeService.three = function(args) {args.production*=3;};
      spec.upgradeService.four = function(args) {args.production*=4;};
      spec.state.player.resources.xH = 3250;
      spec.state.player.resources.dark_matter = 3250;
      spec.state.player.element_slots[0].upgrades = {
        '1-1': true,
        '1-2': true,
        '1-3': false
      };

      let value = spec.generators.generatorProduction(spec.state.player, '1',spec.state.player.element_slots[0]);

      expect(value).toEqual(854);
    });

    it('should calculate the tier production', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      spec.data.elements.H = {
        exotic: 'xH'
      };
      spec.data.upgrades = {
        '1-1': {
          tiers: ['1'],
          function: 'two',
          tags: ['production', '1']
        },
        '1-2': {
          tiers: ['1'],
          function: 'three',
          tags: ['production', '1']
        },
        '1-3': {
          tiers: ['1'],
          function: 'four',
          tags: ['production', '1']
        }
      };
      spec.upgradeService.two = function(args) {args.production*=2;};
      spec.upgradeService.three = function(args) {args.production*=3;};
      spec.upgradeService.four = function(args) {args.production*=4;};
      spec.state.player.resources.xH = 0;
      spec.state.player.resources.dark_matter = 0;
      spec.state.player.element_slots[0] = {
        element: 'H',
        upgrades:{
          '1-1': true,
          '1-2': true,
          '1-3': false
        },
        generators: {
          '1': 10
        }
      };

      let value = spec.generators.tierProduction(spec.state.player, '1',spec.state.player.element_slots[0]);

      expect(value).toEqual(60);
    });

    it('should calculate the element production', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators = {
        '1': {
          price: 15,
          power: 1,
          upgrades: []
        },
        '2': {
          price: 100,
          power: 10,
          upgrades: []
        },
        '3': {
          price: 1100,
          power: 80,
          upgrades: []
        }
      };
      spec.data.elements.H = {
        exotic: 'xH'
      };

      spec.state.player.resources.xH = 0;
      spec.state.player.resources.dark_matter = 0;
      spec.state.player.element_slots[0] = {
        element: 'H',
        generators: {
          '1': 1,
          '2': 1,
          '3': 1
        }
      };

      let value = spec.generators.elementProduction(spec.state.player, spec.state.player.element_slots[0]);

      expect(value).toEqual(91);
    });
  });

  describe('visibility functions', function() {
      it('should show visible generators', function() {
        spec.state.player.element_slots[0].generators['1'] = 1;
        spec.state.player.element_slots[0].generators['2'] = 0;
        spec.state.player.element_slots[0].generators['3'] = 0;
        spec.data.generators = {
          '1': {
            'deps': []
          },
          '2': {
            'deps': ['1']
          },
          '3': {
            'deps': ['2']
          }
        };

        let values = spec.generators.visibleGenerators(spec.state.player.element_slots[0]);

        expect(values).toEqual(['1', '2']);
      });
  });
});
