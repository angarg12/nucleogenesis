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
      player.resources['1H'] = {number:1};
      player.resources.OH = {number:0};

      let value = spec.reaction.isReactionCostMet(1, spec.data.reactions['H.OH-H2O'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 2', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:0};
      player.resources.OH = {number:1};

      let value = spec.reaction.isReactionCostMet(1, spec.data.reactions['H.OH-H2O'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 3', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:5};
      player.resources.OH = {number:5};

      let value = spec.reaction.isReactionCostMet(10, spec.data.reactions['H.OH-H2O'], player);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 4', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:5};
      player.resources.OH = {number:5};

      let value = spec.reaction.isReactionCostMet(1, spec.data.reactions['H.OH-H2O'], player);

      expect(value).toEqual(true);
    });

    it('should check if the cost of a reaction is met 5', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:10};
      player.resources.OH = {number:10};

      let value = spec.reaction.isReactionCostMet(10, spec.data.reactions['H.OH-H2O'], player);

      expect(value).toEqual(true);
    });
  });

  describe('react', function() {
    it('should react the number specified', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:10};
      player.resources.OH = {number:10};
      player.resources.H2O = {number:0};

      spec.reaction.react(5,spec.data.reactions['H.OH-H2O'], player);

      expect(player.resources['1H'].number).toEqual(5);
      expect(player.resources.OH.number).toEqual(5);
      expect(player.resources.H2O.number).toEqual(5);
    });

    it('should return if the number specified is invalid', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:50};
      player.resources.eV = {number:200};
      player.resources.p = {number:1};
      player.resources['e-'] = {number:0};

      spec.reaction.react(0.5,spec.data.reactions['H.OH-H2O'], player);

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

      spec.reaction.react(-10,spec.data.reactions['H.OH-H2O'], player);

      expect(player.resources['1H'].number).toEqual(50);
      expect(player.resources.eV.number).toBeCloseTo(200,4);
      expect(player.resources.p.number).toEqual(1);
      expect(player.resources['e-'].number).toEqual(0);
    });

    it('should return if the cost is not met', function() {
      let player = {};
      player.resources = {};
      player.resources['1H'] = {number:2};
      player.resources.OH = {number:2};
      player.resources.H2O = {number:0};

      spec.reaction.react(5,spec.data.reactions['H.OH-H2O'], player);

      expect(player.resources['1H'].number).toEqual(2);
      expect(player.resources.OH.number).toEqual(2);
      expect(player.resources.H2O.number).toEqual(0);
    });
  });
});
