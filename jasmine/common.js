var commonSpec = function(spec) {
  beforeEach(angular.mock.module('incremental'));

  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, $injector){
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
    spec.controller  = _$controller_('IncCtrl', {$scope:spec.$scope, achievement:spec.achievement, util:spec.util, player:spec.player, savegame:spec.savegame, generator:spec.generator, upgrade:spec.upgrade, animation:spec.animation, format:spec.format, synthesis:spec.synthesis});
    loadData(spec.$scope);
  }));
};