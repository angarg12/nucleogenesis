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
    spec.controller  = _$controller_('IncCtrl', {$scope:spec.$scope, achievement:spec.achievement, util:spec.util, player:spec.player, savegame:spec.savegame});
    loadData(spec.$scope);
  }));
};