/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach */
/* jshint varstmt: false */
'use strict';

describe('Dashboard', function() {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    spec.state.player.resources = {
      '1H': {unlocked:true},
      '2H': {unlocked:false},
      'H2': {unlocked:true},
      'H2O': {unlocked:true},
      eV: {unlocked:true},
      '16O': {unlocked:true}
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
      let values = spec.dashboardList.resourcesForElement('H');

      expect(values).toEqual(['1H','H2','H2O']);
    });

    it('should show misc resources', function() {
      let values = spec.dashboardList.resourcesForElement('');

      expect(values).toEqual(['eV']);
    });

    it('should filter visible resources', function() {
      spec.dashboardList.searchText = 'H2';

      let values = spec.dashboardList.resourcesForElement('H');

      expect(values).toEqual(['H2','H2O']);
    });
  });
});
