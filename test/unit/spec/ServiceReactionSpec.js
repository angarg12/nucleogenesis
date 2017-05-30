/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Reaction service', function() {
  let spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should check if the cost of a reaction is met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:0};
      player.resources.eV = {number:15};

      let value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 2', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:5};
      player.resources.eV = {number:5};

      let value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 3', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:50};

      let value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 4', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:5};
      player.resources.eV = {number:50};

      let value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+'], player);

      expect(value).toEqual(true);
    });

    it('should check if the cost of a reaction is met 5', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:500};

      let value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+'], player);

      expect(value).toEqual(true);
    });
  });

  describe('react', function() {
    it('should react the number specified', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};

      spec.reaction.react(10,spec.data.redox['1H+'], player);

      expect(player.resources['1H'].number).toEqual(40);
      expect(player.resources.eV.number).toBeCloseTo(64.016,4);
      expect(player.resources.p.number).toEqual(11);
      expect(player.resources['e-'].number).toEqual(10);
    });

    it('should return if the number specified is invalid', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};

      spec.reaction.react(0.5,spec.data.redox['1H+'], player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(200,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });

    it('should return if the number specified is negative', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};

      spec.reaction.react(-10,spec.data.redox['1H+'], player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(200,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });

    it('should return if the cost is not met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:10};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};

      spec.reaction.react(5,spec.data.redox['1H+'], player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(10,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });
  });
});
