describe("Achievement service", function() {
  beforeEach(angular.mock.module('incremental'));

  var $controller;
  var $rootScope;
  var $scope;
  var achievement;
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

  describe('toast functions', function() {  
    it("should add toasts to an empty queue", function() {
      achievement.toast = [];
      achievement.is_toast_visible = false;
      
      achievement.addToast('test');
      
      expect(achievement.toast.length).toEqual(1);
      expect(achievement.toast[0]).toEqual('test');
      expect(achievement.is_toast_visible).toEqual(true);
    });
    
    it("should add toasts to an non empty queue", function() {
      achievement.toast = ['a'];
      
      achievement.addToast('test');
      
      expect(achievement.toast.length).toEqual(2);
      expect(achievement.toast[1]).toEqual('test');
    });
    
    it("should not change the visibility of non empty queue", function() {
      achievement.toast = ['a'];
      achievement.is_toast_visible = false;
      
      achievement.addToast('test');
      
      expect(achievement.is_toast_visible).toEqual(false);
    });  
    
    it("should remove toasts", function() {
      achievement.toast = ['test'];
      achievement.is_toast_visible = true;
      
      achievement.removeToast();
      
      expect(achievement.is_toast_visible).toEqual(false);
    });
    
    it("should not flip the visibility when removing toasts", function() {
      achievement.toast = ['test'];
      achievement.is_toast_visible = false;
      
      achievement.removeToast();
      
      expect(achievement.is_toast_visible).toEqual(false);
    });
    
    it("should not fail on empty toast queues", function() {
      achievement.toast = [];
      achievement.is_toast_visible = true;
      
      achievement.removeToast();
      
      expect(achievement.is_toast_visible).toEqual(false);
    });
    
    it("should delete toasts", function() {
      achievement.toast = ['test'];
      
      achievement.deleteToast();
      
      expect(achievement.toast).toEqual([]);
    });
    
    it("should shift toasts", function() {
      achievement.toast = ['test','test2'];
      
      achievement.deleteToast();
      
      expect(achievement.toast).toEqual(['test2']);
    });
    
    it("should make upcoming toasts visible", function() {
      achievement.toast = ['test','test2'];
      achievement.is_toast_visible = false;
      
      achievement.deleteToast();
      
      expect(achievement.is_toast_visible).toEqual(true);
    });
    
    it("should not fail on delete empty lists", function() {
      achievement.toast = [];
      
      achievement.deleteToast();
      
      expect(achievement.toast).toEqual([]);
    });
  });
  
  describe('achievements', function() {
    it("should initialise the listeners of the locked achievements", function() {
      player.player = {unlocks:{}};
      player.player.unlocks["hydrogen"] = false;
    
      achievement.initializeListeners();
      
      expect($scope.unlocks["hydrogen"].listener).not.toBeUndefined();
    });
      
    it("should not initialise the listeners of the unlocked achievements", function() {
      player.player = {unlocks:{}};
      player.player.unlocks["hydrogen"] = true;

      achievement.initializeListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });   
    
    it("should stop running listeners", function() {
      achievement.stopListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });
    
    it("should not start stopped listeners", function() {    
      achievement.stopListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });  
    
    it("should count the number of achievements", function() {    
      value = achievement.numberUnlocks();
      
      expect(value).toEqual(Object.keys($scope.unlocks).length);
    });
    
    it("should count the number of achievements unlocked", function() {
      player.player = {unlocks:{}};
      player.player.unlocks["helium"] = true;
      
      value = achievement.numberUnlocked();
      
      expect(value).toEqual(1);
    });
  });
});