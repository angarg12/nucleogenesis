var commonSpec = function(spec) {
  beforeEach(angular.mock.module('incremental'));

  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, _$httpBackend_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    spec.$timeout = _$timeout_;
    spyOn(_$rootScope_, '$emit').and.callThrough();
    spec.$scope = _$rootScope_.$new();
    spec.achievement = $injector.get('achievement');
    spec.util = $injector.get('util');
    spec.player = $injector.get('player');
    spec.savegame = $injector.get('savegame');
    spec.generator = $injector.get('generator');
    spec.upgrade = $injector.get('upgrade');
    spec.animation = $injector.get('animation');
    spec.format = $injector.get('format');
    spec.synthesis = $injector.get('synthesis');
    spec.reaction = $injector.get('reaction');
    spec.element = $injector.get('element');
    spec.data = $injector.get('data');

    jasmine.getJSONFixtures().fixturesPath = 'base/src/data/';
    _$httpBackend_.whenGET('src/data/generators.json').respond(
    		getJSONFixture('generators.json')
        );
    _$httpBackend_.whenGET('src/data/upgrades.json').respond(
    		getJSONFixture('upgrades.json')
        );
    _$httpBackend_.whenGET('src/data/elements.json').respond(
    		getJSONFixture('elements.json')
        );
    _$httpBackend_.whenGET('src/data/encyclopedia.json').respond(
    		getJSONFixture('encyclopedia.json')
        );
    _$httpBackend_.whenGET('src/data/periodic_table.json').respond(
    		getJSONFixture('periodic_table.json')
        );
    
    spec.controller  = _$controller_('IncCtrl', {$scope:spec.$scope, achievement:spec.achievement, util:spec.util, player:spec.player, savegame:spec.savegame, generator:spec.generator, upgrade:spec.upgrade, animation:spec.animation, format:spec.format, synthesis:spec.synthesis, reaction:spec.reaction, element:spec.element, data:spec.data});
    _$httpBackend_.flush();
  }));
};