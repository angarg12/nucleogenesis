/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Redox component', function () {
  let spec = {};

  commonSpec(spec);

  describe('redox', function () {
    it('should add redox', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.global_upgrades.redox_slots = 1;

      spec.redox.addRedox(playerCopy);

      expect(playerCopy.redox.length).toEqual(1);
    });

    it('should not add redox if no slots are available', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.global_upgrades.redox_slots = 1;
      playerCopy.redox = [1];

      expect(playerCopy.redox.length).toEqual(1);

      spec.redox.addRedox(playerCopy);

      expect(playerCopy.redox.length).toEqual(1);
    });

    it('should remove redox', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.redox = [1];

      expect(playerCopy.redox.length).toEqual(1);

      spec.redox.removeRedox(playerCopy, 0);

      expect(playerCopy.redox.length).toEqual(0);
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

    it('should generate the ion name for protons', function () {
      let ion = spec.redox.generateName('H', 1);

      expect(ion).toEqual('p');
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
        'product': {'p': 1, 'e-': 1}
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
        'reactant': {'p': 1},
        'product': {'p': 1}
      });
    });

    it('should process redoxes', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      let redox = {
        resource: '1H',
        active: true,
        element: 'H',
        from: 0,
        to: 1
      };
      playerCopy.redox = [redox];
      playerCopy.resources['1H'].number = 100;
      playerCopy.resources.eV.number = 200;
      // mock redoxPower
      spec.redox.redoxPower = function() {return 10;};

      spec.state.update(playerCopy);

      expect(playerCopy.resources['1H'].number).toEqual(90);
      expect(playerCopy.resources.eV.number).toBeCloseTo(64.016);
      expect(playerCopy.resources['e-'].number).toEqual(10);
      expect(playerCopy.resources.p.number).toEqual(10);
    });

    it('should not process inactive redoxes', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      let redox = {
        resource: '1H',
        active: false,
        element: 'H',
        from: 0,
        to: 1
      };
      playerCopy.redox = [redox];
      playerCopy.resources['1H'].number = 100;
      playerCopy.resources.eV.number = 200;
      // mock redoxPower
      spec.redox.redoxPower = function() {return 10;};

      spec.state.update(playerCopy);

      expect(playerCopy.resources['1H'].number).toEqual(100);
      expect(playerCopy.resources.eV.number).toEqual(200);
      expect(playerCopy.resources['e-'].number).toEqual(0);
      expect(playerCopy.resources.p.number).toEqual(0);
    });

    it('should cap at the resource number', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      let redox = {
        resource: '1H',
        active: true,
        element: 'H',
        from: 0,
        to: 1
      };
      playerCopy.redox = [redox];
      playerCopy.resources['1H'].number = 100;
      playerCopy.resources.eV.number = 2000;
      // mock redoxPower
      spec.redox.redoxPower = function() {return 2000;};

      spec.state.update(playerCopy);

      expect(playerCopy.resources['1H'].number).toEqual(0);
      expect(playerCopy.resources.eV.number).toBeCloseTo(640.16);
      expect(playerCopy.resources['e-'].number).toEqual(100);
      expect(playerCopy.resources.p.number).toEqual(100);
    });

    it('should not react of not enough colaterals are available', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      let redox = {
        resource: '1H',
        active: true,
        element: 'H',
        from: 0,
        to: 1
      };
      playerCopy.redox = [redox];
      playerCopy.resources['1H'].number = 100;
      playerCopy.resources.eV.number = 200;
      // mock redoxPower
      spec.redox.redoxPower = function() {return 2000;};

      spec.state.update(playerCopy);

      expect(playerCopy.resources['1H'].number).toEqual(100);
      expect(playerCopy.resources.eV.number).toEqual(200);
      expect(playerCopy.resources['e-'].number).toEqual(0);
      expect(playerCopy.resources.p.number).toEqual(0);
    });
  });
});
