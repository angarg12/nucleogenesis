/* eslint no-var: 0 */
/* globals inject,beforeEach,window, */
/* exported commonSpec */
/* jshint varstmt: false */
'use strict';

let originalData = null;
let commonSpec = function(spec) {

  beforeEach(angular.mock.module('game'));

  beforeEach(angular.mock.module(function (_$provide_) {
      spec.$provide = _$provide_;
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, _$injector_, _$componentController_){
    originalData = originalData || angular.copy(_$injector_.get('data'));
    spec.$provide.value('data', angular.copy(originalData));

    window.ga = function () {};
    // The injector unwraps the underscores (_) from around the parameter names when matching
    spec.$timeout = _$timeout_;
    spec.savegame = _$injector_.get('savegame');
    spec.util = _$injector_.get('util');
    spec.format = _$injector_.get('format');
    spec.reaction = _$injector_.get('reaction');
    spec.visibility = _$injector_.get('visibility');
    spec.data = _$injector_.get('data');
    spec.state = _$injector_.get('state');

    spec.core = _$componentController_('core', null, null);
    spec.nova = _$componentController_('nova', null, null);
    spec.supernova = _$componentController_('supernova', null, null);
    spec.void = _$componentController_('void', null, null);
    spec.redox = _$componentController_('redox', null, null);
    spec.reactor = _$componentController_('reactor', null, null);
    spec.matter = _$componentController_('matter', null, null);
    spec.options = _$componentController_('options', null, null);
    spec.achievements = _$componentController_('achievements', null, null);

    // asinine sanity check for components

    _$componentController_('elementSelect', null, null);
    _$componentController_('getHtml', null, null);
    _$componentController_('pretty', null, null);
    _$componentController_('sidebar', null, null);
    _$componentController_('reactionTable', null, null);

    spec.controller = _$controller_('main-loop', {$scope:_$rootScope_.$new(), visibility:spec.visibility, state:spec.state});
  }));
};
