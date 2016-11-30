describe("Achievements service", function() {
  beforeEach(angular.mock.module('incremental'));

  var $controller;
  var $rootScope;
  var $scope;
  var achievements;
  
  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    spyOn($rootScope, '$emit').and.callThrough();
    $scope = $rootScope.$new();
    achievements = $injector.get('achievements');
    $controller('IncCtrl', {$scope:$scope, achievements:achievements});
    loadData($scope);
  }));

  describe('toast functions', function() {  
    it("should add toasts to an empty queue", function() {
      achievements.toast = [];
      achievements.is_toast_visible = false;
      
      achievements.addToast('test');
      
      expect(achievements.toast.length).toEqual(1);
      expect(achievements.toast[0]).toEqual('test');
      expect(achievements.is_toast_visible).toEqual(true);
    });
    
    it("should add toasts to an non empty queue", function() {
      achievements.toast = ['a'];
      
      achievements.addToast('test');
      
      expect(achievements.toast.length).toEqual(2);
      expect(achievements.toast[1]).toEqual('test');
    });
    
    it("should not change the visibility of non empty queue", function() {
      achievements.toast = ['a'];
      achievements.is_toast_visible = false;
      
      achievements.addToast('test');
      
      expect(achievements.is_toast_visible).toEqual(false);
    });  
    
    it("should remove toasts", function() {
      achievements.toast = ['test'];
      achievements.is_toast_visible = true;
      
      achievements.removeToast();
      
      expect(achievements.is_toast_visible).toEqual(false);
    });
    
    it("should not flip the visibility when removing toasts", function() {
      achievements.toast = ['test'];
      achievements.is_toast_visible = false;
      
      achievements.removeToast();
      
      expect(achievements.is_toast_visible).toEqual(false);
    });
    
    it("should not fail on empty toast queues", function() {
      achievements.toast = [];
      achievements.is_toast_visible = true;
      
      achievements.removeToast();
      
      expect(achievements.is_toast_visible).toEqual(false);
    });
    
    it("should delete toasts", function() {
      achievements.toast = ['test'];
      
      achievements.deleteToast();
      
      expect(achievements.toast).toEqual([]);
    });
    
    it("should shift toasts", function() {
      achievements.toast = ['test','test2'];
      
      achievements.deleteToast();
      
      expect(achievements.toast).toEqual(['test2']);
    });
    
    it("should make upcoming toasts visible", function() {
      achievements.toast = ['test','test2'];
      achievements.is_toast_visible = false;
      
      achievements.deleteToast();
      
      expect(achievements.is_toast_visible).toEqual(true);
    });
    
    it("should not fail on delete empty lists", function() {
      achievements.toast = [];
      
      achievements.deleteToast();
      
      expect(achievements.toast).toEqual([]);
    });
  });
  
  describe('achievements', function() {
    it("should initialise the listeners of the locked achievements", function() {
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["hydrogen"] = false;
    
      achievements.initializeListeners();
      
      expect($scope.unlocks["hydrogen"].listener).not.toBeUndefined();
    });
      
    it("should not initialise the listeners of the unlocked achievements", function() {
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["hydrogen"] = true;

      achievements.initializeListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });   
    
    it("should stop running listeners", function() {
      achievements.stopListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });
    
    it("should not start stopped listeners", function() {    
      achievements.stopListeners();
      
      expect($scope.unlocks["hydrogen"].listener).toBeUndefined();
    });  
    
    it("should count the number of achievements", function() {    
      value = achievements.numberUnlocks();
      
      expect(value).toEqual(Object.keys($scope.unlocks).length);
    });
    
    it("should count the number of achievements unlocked", function() {
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["helium"] = true;
      
      value = achievements.numberUnlocked();
      
      expect(value).toEqual(1);
    });
  });
});