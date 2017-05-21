/* eslint no-var: 0 */
/* globals inject,beforeEach,spyOn, */
/* exported commonSpec */
/* jshint varstmt: false */
'use strict';

var commonSpec = function(spec) {
  var originalData = null;

  beforeEach(angular.mock.module('game'));

  beforeEach(angular.mock.module(function (_$provide_) {
      spec.$provide = _$provide_;
  }));

  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, _$httpBackend_, _$injector_, _$componentController_){
    originalData = originalData || angular.copy(_$injector_.get('data'));
    spec.$provide.value('data', angular.copy(originalData));

    // The injector unwraps the underscores (_) from around the parameter names when matching
    spec.$timeout = _$timeout_;
    spyOn(_$rootScope_, '$broadcast').and.callThrough();
    spyOn(_$rootScope_, '$emit');
    spec.$rootScope = _$rootScope_;
    spec.$scope = _$rootScope_.$new();
    spyOn(spec.$scope, '$on');
    spec.achievement = _$injector_.get('achievement');
    spec.util = _$injector_.get('util');
    spec.savegame = _$injector_.get('savegame');
    spec.generator = _$injector_.get('generator');
    spec.format = _$injector_.get('format');
    spec.synthesis = _$injector_.get('synthesis');
    spec.reaction = _$injector_.get('reaction');
    spec.element = _$injector_.get('element');
    spec.visibility = _$injector_.get('visibility');
    spec.data = _$injector_.get('data');
    spec.state = _$injector_.get('state');

    spec.nova = _$componentController_('nova', null, null);

    spec.controller = _$controller_('main-loop', {$scope:spec.$scope, achievement:spec.achievement, util:spec.util, savegame:spec.savegame, generator:spec.generator, format:spec.format, synthesis:spec.synthesis, reaction:spec.reaction, element:spec.element, data:spec.data, state:spec.state});
  }));
};
