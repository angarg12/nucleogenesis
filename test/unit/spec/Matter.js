/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Matter component', function() {
  let spec = {};

  commonSpec(spec);

  describe('purchase', function() {
    it('should return the price of a generator', function() {
      let player = {};
      player.elements = {'H':{}};
      player.elements.H = {'generators':{}};
      player.elements.H.generators['1'] = 5;

      let value = spec.matter.generatorPrice(player, '1','H', 1);

      expect(value).toEqual(20);
    });

    it('should return the price of a generator 2', function() {
      let player = {};
      player.elements = {'H':{}};
      player.elements.H = {'generators':{}};
      player.elements.H.generators['3'] = 10;

      let value = spec.matter.generatorPrice(player, '3','H', 1);

      expect(value).toEqual(1792);
    });

    it('should return the price of a generator 3', function() {
      let player = {};
      player.elements = {'H':{}};
      player.elements.H = {'generators':{}};
      player.elements.H.generators['1'] = 1;

      let value = spec.matter.generatorPrice(player, '1','H', 10);

      expect(value).toEqual(205);
    });

    it('should return the price of a generator 4', function() {
      let player = {};
      player.elements = {'H':{}};
      player.elements.H = {'generators':{}};
      player.elements.H.generators['1'] = 10;

      let value = spec.matter.generatorPrice(player, '1','H', 100);

      expect(value).toEqual(63823);
    });

    it('should return the price of a generator 4', function() {
      let player = {};
      player.elements = {'H':{}};
      player.elements.H = {'generators':{}};
      player.elements.H.generators['1'] = 10;
      spyOn(spec.matter, 'maxCanBuy');

      spec.matter.generatorPrice(player, '1','H', 'max');

      expect(spec.matter.maxCanBuy).toHaveBeenCalled();
    });

    it('should purchase as many generators as requested', function() {
      let player = {elements:{},resources:{}};
      player.resources['1H'] = {number:65};
      player.elements.H = {generators:{}};
      player.elements.H.generators['1'] = 5;

      spec.matter.buyGenerators(player, '1','H',3);

      expect(player.resources['1H'].number).toEqual(2);
      expect(player.elements.H.generators['1']).toEqual(8);
    });

    it('should purchase as many generators as possible', function() {
      let player = {elements:{},resources:{}};
      player.resources['1H'] = {number:45};
      player.elements.H = {generators:{}};
      player.elements.H.generators['1'] = 5;

      spec.matter.buyGenerators(player, '1','H','max');

      expect(player.resources['1H'].number).toEqual(4);
      expect(player.elements.H.generators['1']).toEqual(7);
    });

    it('should not purchase generator if cost is not met', function() {
      let player = {elements:{},resources:{}};
      player.resources['1H'] = {number:10};
      player.elements.H = {generators:{}};
      player.elements.H.generators['1'] = 5;

      spec.matter.buyGenerators(player, '1','H',10);

      expect(player.resources['1H'].number).toEqual(10);
      expect(player.elements.H.generators['1']).toEqual(5);
    });
  });

  describe('production functions', function() {
    it('should calculate the generator production', function() {
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 0};
      player.resources.dark_matter = {number: 0};
      player.elements.H = {upgrades:{}};
      player.elements.H.upgrades['1-1'] = true;
      player.elements.H.upgrades['1-2'] = true;
      player.elements.H.upgrades['1-3'] = false;

      let value = spec.matter.generatorProduction(player, '1','H');

      expect(value).toEqual(6);
    });

    it('should calculate the generator production with exotic matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 3250};
      player.resources.dark_matter = {number: 0};
      player.elements.H = {upgrades:{}};
      player.elements.H.upgrades['1-1'] = true;
      player.elements.H.upgrades['1-2'] = true;
      player.elements.H.upgrades['1-3'] = false;

      let value = spec.matter.generatorProduction(player, '1','H');

      expect(value).toEqual(25);
    });

    it('should calculate the generator production with dark matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 0};
      player.resources.dark_matter = {number: 3250};
      player.elements.H = {upgrades:{}};
      player.elements.H.upgrades['1-1'] = true;
      player.elements.H.upgrades['1-2'] = true;
      player.elements.H.upgrades['1-3'] = false;

      let value = spec.matter.generatorProduction(player, '1','H');

      expect(value).toEqual(201);
    });

    it('should calculate the generator production with exotic and dark matter', function() {
      spec.data.constants.EXOTIC_POWER = 0.001;
      spec.data.constants.DARK_POWER = 0.01;
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 3250};
      player.resources.dark_matter = {number: 3250};
      player.elements.H = {upgrades:{}};
      player.elements.H.upgrades['1-1'] = true;
      player.elements.H.upgrades['1-2'] = true;
      player.elements.H.upgrades['1-3'] = false;

      let value = spec.matter.generatorProduction(player, '1','H');

      expect(value).toEqual(854);
    });

    it('should calculate the tier production', function() {
      spec.data.generators['1'].upgrades = ['1-1','1-2','1-3'];
      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 0};
      player.resources.dark_matter = {number: 0};
      player.elements.H = {upgrades:{},generators:{}};
      player.elements.H.upgrades['1-1'] = true;
      player.elements.H.upgrades['1-2'] = true;
      player.elements.H.upgrades['1-3'] = false;
      player.elements.H.generators['1'] = 10;

      let value = spec.matter.tierProduction(player, '1','H');

      expect(value).toEqual(60);
    });

    it('should calculate the element production', function() {
      spec.data.generators['1'].upgrades = [];
      spec.data.generators['2'].upgrades = [];
      spec.data.generators['3'].upgrades = [];
      let temp1 = spec.data.generators['1'];
      let temp2 = spec.data.generators['2'];
      let temp3 = spec.data.generators['3'];
      spec.data.generators = {};
      spec.data.generators['1'] = temp1;
      spec.data.generators['2'] = temp2;
      spec.data.generators['3'] = temp3;

      let player = {elements:{}, resources:{}};
      player.resources.xH = {number: 0};
      player.resources.dark_matter = {number: 0};
      player.elements.H = {generators:{}};
      player.elements.H.generators['1'] = 1;
      player.elements.H.generators['2'] = 1;
      player.elements.H.generators['3'] = 1;

      let value = spec.matter.elementProduction(player, 'H');

      expect(value).toEqual(91);
    });
  });

  describe('visibility functions', function() {
      it('should show visible generators', function() {
        spec.state.player = {elements:{}};
        spec.state.player.elements.H = {generators:[]};
        spec.state.player.elements.H.generators['1'] = 1;
        spec.state.player.elements.H.generators['2'] = 0;
        spec.state.player.elements.H.generators['3'] = 0;
        let temp = spec.data.generators;
        spec.data.generators = {};
        spec.data.generators['1'] = temp['1'];
        spec.data.generators['2'] = temp['2'];
        spec.data.generators['3'] = temp['3'];

        let values = spec.matter.visibleGenerators('H');

        expect(values).toEqual(['1', '2']);
      });
  });
});
