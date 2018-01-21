/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Dashboard', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.state.player.resources = {
      '1H': 0,
      '2H': null,
      'H2': 0,
      'H2O': 0,
      eV: 0,
      '16O': 0
    };
    spec.data.resources = {
      '1H': {elements: {H:1}},
      '2H': {elements: {H:1}},
      'H2': {elements: {H:2}},
      'H2O': {elements: {H:2,O:1}},
      eV: {elements: {}},
      '16O': {elements: {O:1}}
    };
  });

  describe('visibility functions', function() {
    it('should show visible resources for element', function() {
      let values = spec.dashboardList.resourcesForElement('H', spec.state.player);

      expect(values).toEqual(['1H','H2','H2O']);
    });

    it('should show misc resources', function() {
      let values = spec.dashboardList.resourcesForElement('', spec.state.player);

      expect(values).toEqual(['eV']);
    });

    it('should filter visible resources', function() {
      spec.dashboardList.searchText = 'H2';

      let values = spec.dashboardList.resourcesForElement('H', spec.state.player);

      expect(values).toEqual(['H2','H2O']);
    });
  });
});
