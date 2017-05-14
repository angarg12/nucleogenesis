/* globals describe,commonSpec,it,expect */
// jshint varstmt: false
'use strict';

describe('Reaction service', function() {
  var spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it('should check if the cost of a reaction is met', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:0};
      spec.state.player.resources.eV = {number:15};

      var value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 2', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:5};
      spec.state.player.resources.eV = {number:5};

      var value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 3', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:50};

      var value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+']);

      expect(value).toEqual(false);
    });

    it('should check if the cost of a reaction is met 4', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:5};
      spec.state.player.resources.eV = {number:50};

      var value = spec.reaction.isReactionCostMet(1, spec.data.redox['1H+']);

      expect(value).toEqual(true);
    });

    it('should check if the cost of a reaction is met 5', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:500};

      var value = spec.reaction.isReactionCostMet(10, spec.data.redox['1H+']);

      expect(value).toEqual(true);
    });
  });

  describe('react', function() {
    it('should react the number specified', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:200};
      spec.state.player.resources.p = {number:1};
      spec.state.player.resources['e-'] = {number:0};

      spec.reaction.react(10,spec.data.redox['1H+'], spec.state.player);

      expect(spec.state.player.resources['1H'].number).toEqual(40);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(64.016,4);
      expect(spec.state.player.resources.p.number).toEqual(11);
      expect(spec.state.player.resources['e-'].number).toEqual(10);
    });

    it('should return if the number specified is invalid', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:200};
      spec.state.player.resources.p = {number:1};
      spec.state.player.resources['e-'] = {number:0};

      spec.reaction.react(0.5,spec.data.redox['1H+'], spec.state.player);

      expect(spec.state.player.resources['1H'].number).toEqual(50);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(200,4);
      expect(spec.state.player.resources.p.number).toEqual(1);
      expect(spec.state.player.resources['e-'].number).toEqual(0);
    });

    it('should return if the number specified is negative', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:200};
      spec.state.player.resources.p = {number:1};
      spec.state.player.resources['e-'] = {number:0};

      spec.reaction.react(-10,spec.data.redox['1H+'], spec.state.player);

      expect(spec.state.player.resources['1H'].number).toEqual(50);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(200,4);
      expect(spec.state.player.resources.p.number).toEqual(1);
      expect(spec.state.player.resources['e-'].number).toEqual(0);
    });

    it('should return if the cost is not met', function() {
      spec.state.player = {};
      spec.state.player.resources = {};
      spec.state.player.resources['1H'] = {number:50};
      spec.state.player.resources.eV = {number:10};
      spec.state.player.resources.p = {number:1};
      spec.state.player.resources['e-'] = {number:0};

      spec.reaction.react(5,spec.data.redox['1H+'], spec.state.player);

      expect(spec.state.player.resources['1H'].number).toEqual(50);
      expect(spec.state.player.resources.eV.number).toBeCloseTo(10,4);
      expect(spec.state.player.resources.p.number).toEqual(1);
      expect(spec.state.player.resources['e-'].number).toEqual(0);
    });
  });
});
