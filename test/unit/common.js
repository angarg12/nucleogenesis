/* eslint no-var: 0 */
/* globals inject,beforeEach,window, */
/* exported commonSpec */
/* jshint varstmt: false */
'use strict';

let commonSpec = function(spec) {
  spec.originalData = null;
  beforeEach(angular.mock.module('game'));

  beforeEach(angular.mock.module(function (_$provide_) {
      spec.$provide = _$provide_;
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, _$injector_, _$componentController_){
    window.ga = function () {};
    // The injector unwraps the underscores (_) from around the parameter names when matching
    spec.$timeout = _$timeout_;

    if(!spec.originalData){
      spec.originalData = angular.copy(_$injector_.get('data'));
    }
    spec.data = {};
    spec.data.achievements = {};
    spec.data.constants = {};
    spec.data.elements = {};
    spec.data.generators = {};
    spec.data.reactions = {};
    spec.data.redox = {};
    spec.data.resources = {};
    spec.data.upgrades = {};
    spec.data.global_upgrades = {};
    spec.data.exotic_upgrades = {};
    spec.data.dark_upgrades = {};
    spec.data.html = {};
    spec.data.radioisotopes = [];
    spec.$provide.constant('data', spec.data);

    spec.savegame = _$injector_.get('savegame');
    spec.util = _$injector_.get('util');
    spec.format = _$injector_.get('format');
    spec.reaction = _$injector_.get('reaction');
    spec.visibility = _$injector_.get('visibility');
    spec.state = _$injector_.get('state');

    spec.state.player.elements = {};
    spec.state.player.unlocks = {};
    spec.state.player.reactions = [];
    spec.state.player.redox = [];
    spec.state.player.resources = {};
    spec.state.player.achievements = {};
    spec.state.player.upgrades = {};
    spec.state.player.exotic_upgrades = {};
    spec.state.player.dark_upgrades = {};
    spec.state.player.global_upgrades = {};

    spec.core = _$componentController_('core', null, null);
    spec.nova = _$componentController_('nova', null, null);
    spec.supernova = _$componentController_('supernova', null, null);
    spec.void = _$componentController_('void', null, null);
    spec.redox = _$componentController_('redox', null, null);
    spec.reactor = _$componentController_('reactor', null, null);
    spec.matter = _$componentController_('matter', null, null);
    spec.options = _$componentController_('options', null, null);
    spec.achievements = _$componentController_('achievements', null, null);
    spec.elementSelect = _$componentController_('elementSelect', null, null);
    spec.sidebar = _$componentController_('sidebar', null, null);
    spec.reactionTable = _$componentController_('reactionTable', null, {reactor: spec.reactor});

    // asinine sanity check for components
    _$componentController_('getHtml', null, null);
    _$componentController_('pretty', null, null);

    spec.controller = _$controller_('main-loop', {$scope:_$rootScope_.$new(), visibility:spec.visibility, state:spec.state});
  }));
};
