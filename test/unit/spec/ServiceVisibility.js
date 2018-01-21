/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Visible service', function() {
  let spec = {};

  commonSpec(spec);

  describe('visibility functions', function() {
    it('should show visible elements', function() {
      spec.data.elements = {'H':{},'C':{},'O':{}};
      spec.state.player.elements.H = true;
      spec.data.elements.H.includes = ['1H'];
      spec.state.player.elements.C = true;
      spec.data.elements.C.includes = ['8C'];
      spec.state.player.elements.O = false;
      spec.data.elements.O.includes = ['16O'];
      spec.state.player.resources['1H'] = 0;
      spec.state.player.resources['8C'] = null;
      spec.state.player.resources['16O'] = null;

      let values = spec.elementSelect.visibleElements(spec.state.player);

      expect(values).toEqual(['H', 'C']);
    });

    it('should show visible resources', function() {
      spec.state.player.resources = {
        '1H': 0,
        '2H': null,
        eV: 0,
        '16O': 0
      };
      spec.state.player.statistics = {
        exotic_run: {H:
          {'1H':0}
        }
      };
      spec.data.resources = {
        '1H': {elements: {H:1}},
        '2H': {elements: {H:1}},
        eV: {elements: {}},
        '16O': {elements: {O:1}}
      };

      let values = spec.sidebar.visibleResources('H', spec.state.player);

      expect(values).toEqual(['1H']);
    });

    it('should show misc resources', function() {
      spec.state.player.resources = {
        '1H': 0,
        '2H': null,
        eV: 0,
        '16O': 0
      };
      spec.data.resources = {
        '1H': {elements: {H:1}},
        '2H': {elements: {H:1}},
        eV: {elements: {}},
        '16O': {elements: {O:1}}
      };

      let values = spec.sidebar.visibleResources('', spec.state.player);

      expect(values).toEqual(['eV']);
    });

    it('should show active elements', function() {
      spec.state.player.element_slots = [
        {element:'O'},
        {element:'S'},
        null
      ];

      let values = spec.sidebar.activeElements(spec.state.player);

      expect(values).toEqual(['O','S','']);
    });
  });
});
