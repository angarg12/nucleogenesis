/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach,spyOn */
/* jshint varstmt: false */
'use strict';

describe('Redox', function () {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.data.global_upgrades = {
      redox_slots: {
        price: {
          eV: 10000
        },
        tiers: [],
        deps: [],
        exotic_deps: [],
        dark_deps: [],
        power: {
          base: 1,
          linear: 1
        },
        price_exp: 2,
        repeatable: true
      },
      redox_bandwidth: {
        price: {
          eV: 100
        },
        tiers: [],
        deps: [],
        exotic_deps: [],
        dark_deps: [],
        power: {
          base: 100,
          exp: 2
        },
        price_exp: 1.15,
        repeatable: true
      }
    };
    spec.data.elements = {
      H: {
        main: '1H',
        electronegativity: 0
      }
    };
    spec.data.redox = {
      H: {
        '0': 0,
        '1': 13.5984,
        '-1': -0.7545,
        '-2': 5.1953
      }
    };
    spec.data.resources = {
      '1H': {elements:{H:1}},
      'e-': {elements:{}},
      'eV': {elements:{}}
    };
    spec.state.registerUpdate('redox', spec.redox.update);
  });

  describe('redox', function () {
    it('should add redox', function () {
      spec.state.player.global_upgrades.redox_slots = 1;
      spec.state.player.element_slots = [{
        element: 'H',
        redoxes: []
      }];

      spec.redox.addRedox(spec.state.player, spec.state.player.element_slots[0]);

      expect(spec.state.player.element_slots[0].redoxes.length).toEqual(1);
    });

    it('should not add redox if no slots are available', function () {
      spec.state.player.global_upgrades.redox_slots = 1;
      spec.state.player.element_slots = [{
        element: 'H',
        redoxes: [1]
      }];

      expect(spec.state.player.element_slots[0].redoxes.length).toEqual(1);

      spec.redox.addRedox(spec.state.player, spec.state.player.element_slots[0]);

      expect(spec.state.player.element_slots[0].redoxes.length).toEqual(1);
    });

    it('should remove redox', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        redoxes: [1]
      }];

      expect(spec.state.player.element_slots[0].redoxes.length).toEqual(1);

      spec.redox.removeRedox(spec.state.player.element_slots[0], 0);

      expect(spec.state.player.element_slots[0].redoxes.length).toEqual(0);
    });

    it('should generate the ion name', function () {
      let ion = spec.redox.generateName('H', 0);

      expect(ion).toEqual('1H');
    });

    it('should generate the ion name 2', function () {
      let ion = spec.redox.generateName('H', -2);

      expect(ion).toEqual('H2-');
    });

    it('should generate the ion name 3', function () {
      let ion = spec.redox.generateName('H', 2);

      expect(ion).toEqual('H2+');
    });

    it('should create a reaction from a redox', function () {
      let redox = {
        resource: '1H',
        active: false,
        element: 'H',
        from: 0,
        to: -2
      };

      let reaction = spec.redox.redoxReaction(redox);

      expect(reaction).toEqual({
        'reactant': {'1H': 1, 'e-': 2, 'eV': 5.1953},
        'product': {'H2-': 1}
      });
    });

    it('should create a reaction from a redox 2', function () {
      let redox = {
        resource: '1H',
        active: false,
        element: 'H',
        from: 0,
        to: -1
      };

      let reaction = spec.redox.redoxReaction(redox);

      expect(reaction).toEqual({
        'reactant': {'1H': 1, 'e-': 1},
        'product': {'H-': 1, 'eV': 0.7545}
      });
    });

    it('should create a reaction from a redox 3', function () {
      let redox = {
        resource: '1H',
        active: false,
        element: 'H',
        from: 0,
        to: 1
      };

      let reaction = spec.redox.redoxReaction(redox);

      expect(reaction).toEqual({
        'reactant': {'1H': 1, 'eV': 13.5984},
        'product': {'H+': 1, 'e-': 1}
      });
    });

    it('should create a reaction from a redox 4', function () {
      let redox = {
        resource: '1H',
        active: false,
        element: 'H',
        from: 1,
        to: 1
      };

      let reaction = spec.redox.redoxReaction(redox);

      expect(reaction).toEqual({
        'reactant': {'H+': 1},
        'product': {'H+': 1}
      });
    });

    it('should calculate redox power', function () {
      spec.state.player.global_upgrades.redox_bandwidth = 2;
      spec.state.player.global_upgrades_current.redox_bandwidth = 2;

      let power = spec.util.calculateValue(spec.data.global_upgrades.redox_bandwidth.power.base,
            spec.data.global_upgrades.redox_bandwidth.power,
            spec.state.player.global_upgrades_current.redox_bandwidth);;

      expect(power).toEqual(400);
    });

    it('should process redoxes', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [],
        redoxes: [{
          resource: '1H',
          active: true,
          element: 'H',
          from: 0,
          to: 1
        }]
      }];
      spec.state.player.resources = {
        '1H': 100,
        'e-': 0,
        'H+': 0,
        eV: 200
      };
      spec.state.player.resources['1H'] = 100;
      spec.state.player.resources['e-'] = 0;
      spec.state.player.resources['H+'] = 0;
      spec.state.player.resources.eV = 200;
      // mock redoxPower
      spec.util.calculateValue = function() {return 10;};

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(90);
      expect(spec.state.player.resources.eV).toBeCloseTo(64.016);
      expect(spec.state.player.resources['e-']).toEqual(10);
      expect(spec.state.player.resources['H+']).toEqual(10);
    });

    it('should not process inactive redoxes', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [],
        redoxes: [{
          resource: '1H',
          active: false,
          element: 'H',
          from: 0,
          to: 1
        }]
      }];
      spec.state.player.resources = {
        '1H': 100,
        'e-': 0,
        'H+': 0,
        eV: 200
      };
      // mock redoxPower
      spec.util.calculateValue = function() {return 10;};

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(100);
      expect(spec.state.player.resources.eV).toEqual(200);
      expect(spec.state.player.resources['e-']).toEqual(0);
      expect(spec.state.player.resources['H+']).toEqual(0);
    });

    it('should cap at the resource number', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [],
        redoxes: [{
          resource: '1H',
          active: true,
          element: 'H',
          from: 0,
          to: 1
        }]
      }];
      spec.state.player.resources = {
        '1H': 100,
        'e-': 0,
        'H+': 0,
        eV: 2000
      };
      // mock redoxPower
      spec.util.calculateValue = function() {return 2000;};

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(0);
      expect(spec.state.player.resources.eV).toBeCloseTo(640.16);
      expect(spec.state.player.resources['e-']).toEqual(100);
      expect(spec.state.player.resources['H+']).toEqual(100);
    });

    it('should not react of not enough collaterals are available', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [],
        redoxes: [{
          resource: '1H',
          active: true,
          element: 'H',
          from: 0,
          to: 1
        }]
      }];
      spec.state.player.resources = {
        '1H': 100,
        'e-': 0,
        p: 0,
        eV: 200
      };
      // mock redoxPower
      spec.util.calculateValue = function() {return 2000;};

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources['1H']).toEqual(100);
      expect(spec.state.player.resources.eV).toEqual(200);
      expect(spec.state.player.resources['e-']).toEqual(0);
      expect(spec.state.player.resources.p).toEqual(0);
    });

    it('should not react if from and to are the same', function () {
      spec.state.player.element_slots = [{
        element: 'H',
        reactions: [],
        redoxes: [{
          resource: '1H',
          active: true,
          element: 'H',
          from: 0,
          to: 0
        }]
      }];
      spec.state.player.resources = {
        '1H': 100,
        'e-': 0,
        p: 0,
        eV: 200
      };

      spyOn(spec.util, 'calculateValue');

      spec.state.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.util.calculateValue).not.toHaveBeenCalled();
    });
  });

  describe('visibility functions', function() {
    it('should show visible redoxes', function() {
      let redoxes = [{
        resource: '1H',
        number: 50,
        active: false,
        element: 'H',
        from: 0,
        to: 1
      },{
        resource: '16O',
        number: 50,
        active: false,
        element: 'O',
        from: 0,
        to: 1
      }];
      spec.state.player.element_slots = [{
        element: 'H',
        redoxes: redoxes
      }];

      let values = spec.redox.visibleRedox(spec.state.player.element_slots[0]);

      expect(values).toEqual(redoxes);
    });
  });

  describe('electronegativity', function() {
    it('should process electronegativity', function() {
      spec.data.elements = {
        O: {
          main: '16O',
          electronegativity: 3.44,
          ionization_energy: [
            13.61806,
            35.1173,
            54.9355,
            77.41353,
            113.899
          ],
          electron_affinity: [
            -1.4614,
            8.8899
          ],
          anions: [
            'O-',
            'O2-'
          ],
          cations: [
            'O+',
            'O2+',
            'O3+',
            'O4+',
            'O5+'
          ],
          negative_factor: 549.5408738576248,
          positive_factor: 3.4673685045253166
        }
      };
      spec.state.player.resources = {
        '16O': 1e25,
        'O-': 0,
        'O2-': 0,
        'O+': 0,
        'O2+': 0,
        'O3+': 0,
        'O4+': 0,
        'O5+': 0,
        'e-': 1e6,
        eV: 0
      };
      spec.data.resources = {
        '16O': {elements:{O:1},charge:0},
        'O-': {elements:{O:1},charge:-1},
        'O2-': {elements:{O:1},charge:-2},
        'O+': {elements:{O:1},charge:1},
        'O2+': {elements:{O:1},charge:2},
        'O3+': {elements:{O:1},charge:3},
        'O4+': {elements:{O:1},charge:4},
        'O5+': {elements:{O:1},charge:5},
        'e-': {elements:{}},
        eV: {elements:{}}
      };
      spec.data.redox = {
        'O': {
          '0': 0,
          '1': 13.61806,
          '2': 48.73536,
          '3': 103.67086,
          '4': 181.08439,
          '5': 294.98339,
          '-1': -1.4614,
          '-2': 7.4285
        }
      };
      spec.data.constants.ELECTRONEGATIVITY_CHANCE = 0.00001;

      spec.redox.update(spec.state.player);
      spec.reaction.processReactions(spec.state.reactions, spec.state.player);

      expect(spec.state.player.resources['16O'].toPrecision(5)).toEqual('1.0000e+25');
      expect(spec.state.player.resources['O-'].toPrecision(5)).toEqual('3.3333e+5');
      expect(spec.state.player.resources['O2-'].toPrecision(5)).toEqual('6.6667e+5');
      expect(spec.state.player.resources['O+'].toPrecision(5)).toEqual('2.5259e+19');
      expect(spec.state.player.resources['O2+'].toPrecision(5)).toEqual('9.7950e+13');
      expect(spec.state.player.resources['O3+'].toPrecision(5)).toEqual('6.2614e+8');
      expect(spec.state.player.resources['O4+']).toEqual(4443);
      expect(spec.state.player.resources['O5+']).toEqual(0);
      expect(spec.state.player.resources['e-'].toPrecision(5)).toEqual('2.5259e+19');
      expect(spec.state.player.resources.eV.toPrecision(5)).toEqual('4.8713e+5');
    });
  });
});
