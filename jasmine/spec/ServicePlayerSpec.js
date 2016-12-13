describe("Player service", function() {
  beforeEach(angular.mock.module('incremental'));

  var $controller;
  var $rootScope;
  var $scope;
  var player;
  
  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    spyOn($rootScope, '$emit').and.callThrough();
    $scope = $rootScope.$new();
    achievement = $injector.get('achievement');
    util = $injector.get('util');
    player = $injector.get('player');
    controller  = $controller('IncCtrl', {$scope:$scope, achievement:achievement, util:util, player:player});
    loadData($scope);
  }));


  describe('save and load', function() {
    var getItemSpy;
    
    beforeEach(function() {
      getItemSpy = spyOn(localStorage, "getItem");
      spyOn(localStorage, "setItem");
      spyOn(localStorage, "removeItem");
    });
    
    it("should save player data", function() {
      $scope.lastSave = undefined;
    
      player.save();
      
      expect($scope.lastSave).not.toBeUndefined();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("should load player data", function() {
      localStorage.getItem.isSpy = false;
      getItemSpy.and.returnValue('{}');
      $scope.lastSave = undefined;
      spyOn(player, "reset");
      spyOn(player, "versionControl");
    
      player.load();
      
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(player.reset).not.toHaveBeenCalled();
      expect(player.versionControl).toHaveBeenCalled();
    });
    
    it("should load player data and throw exception", function() {
      $scope.lastSave = undefined;
      spyOn(player, "reset");
      spyOn(player, "versionControl");
    
      player.load();
      
      expect(localStorage.getItem).toHaveBeenCalled();
      expect(player.reset).toHaveBeenCalled();
      expect(player.versionControl).toHaveBeenCalled();
    });
    
    it("should reset player without confirmation", function() {
      $scope.lastSave = undefined;
      spyOn($scope, "init");
      spyOn($scope, "introAnimation");
    
      player.reset(false);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect($scope.init).toHaveBeenCalled();
      expect($scope.introAnimation).toHaveBeenCalled();
    });
    
    it("should reset player with confirmation", function() {
      $scope.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(true);
      spyOn($scope, "init");
      spyOn($scope, "introAnimation");
    
      player.reset(true);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect($scope.init).toHaveBeenCalled();
      expect($scope.introAnimation).toHaveBeenCalled();
    });
    
    it("should not reset player if the confirmation rejets", function() {
      $scope.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(false);
      spyOn($scope, "init");
      spyOn($scope, "introAnimation");
    
      player.reset(true);

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect($scope.init).not.toHaveBeenCalled();
      expect($scope.introAnimation).not.toHaveBeenCalled();
    });
        
    it("should export save", function() {
      spyOn(window, "btoa").and.returnValue("");
    
      player.exportSave();

      expect(window.btoa).toHaveBeenCalled();
    });

    it("should import save", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(window, "atob").and.returnValue("{}");
      spyOn(achievement, "stopListeners");
      spyOn(player, "versionControl");
      spyOn(player, "save");
      spyOn(achievement, "initializeListeners");
    
      player.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(achievement.stopListeners).toHaveBeenCalled();
      expect(player.versionControl).toHaveBeenCalled();
      expect(player.save).toHaveBeenCalled();
      expect(achievement.initializeListeners).toHaveBeenCalled();
    });
    
    it("should not import if save is not presented", function() {
      spyOn(window, "prompt").and.returnValue("");
      spyOn(window, "atob").and.returnValue("{}");
      spyOn(achievement, "stopListeners");
      spyOn(player, "versionControl");
      spyOn(player, "save");
      spyOn(achievement, "initializeListeners");
    
      player.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).not.toHaveBeenCalled();
      expect(achievement.stopListeners).not.toHaveBeenCalled();
      expect(player.versionControl).not.toHaveBeenCalled();
      expect(player.save).not.toHaveBeenCalled();
      expect(achievement.initializeListeners).not.toHaveBeenCalled();
    });
    
    it("should not import if save is invalid", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(window, "atob");
      spyOn(achievement, "stopListeners");
      spyOn(player, "versionControl");
      spyOn(player, "save");
      spyOn(achievement, "initializeListeners");
    
      player.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(achievement.stopListeners).not.toHaveBeenCalled();
      expect(player.versionControl).not.toHaveBeenCalled();
      expect(player.save).not.toHaveBeenCalled();
      expect(achievement.initializeListeners).not.toHaveBeenCalled();
    });
      
    it("should version control", function() {
      player.versionControl();
    });
  });
  
  describe('populate player', function() {   
    it("should populate a new player", function() {      
      player.populatePlayer();
      
      expect(player.startPlayer.resources.H).toEqual({
        number : 15,
        is_new : true,
        unlocked : false
      });
      expect(player.startPlayer.elements.H.unlocked).toEqual(true);
      expect(player.startPlayer.elements.H.upgrades['Tier 1-1'].bought).toEqual(false);
      expect(player.startPlayer.encyclopedia.Hydrogen.is_new).toEqual(true);
      expect(player.startPlayer.unlocks.hydrogen).toEqual(false);
      expect(player.startPlayer.synthesis.H2O).toEqual({
        number : 0,
        active : 0,
        is_new : true
      });
    });
  });
});