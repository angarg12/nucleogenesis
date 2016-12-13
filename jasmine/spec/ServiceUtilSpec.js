describe("Achievement service", function() {
  beforeEach(angular.mock.module('incremental'));

  var $controller;
  var $rootScope;
  var $scope;
  var util;
  
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

  describe('prettifyNumber', function() {
    it("should return inifinity as a symbol", function() {
      value = util.prettifyNumber(Infinity);
      expect(value).toEqual("&infin;");
    });
    
    it("should return empty string as a empty", function() {
      value = util.prettifyNumber('');
      expect(value).toEqual('');
    });
    
    it("should return undefined as undefined", function() {
      value = util.prettifyNumber(undefined);
      expect(value).toBeUndefined();
    });
    
    it("should leave small numbers unchanged", function() {
      value = util.prettifyNumber(1);
      expect(value).toEqual('1');
    });
    
    it("should format numbers with group separation commas", function() {
      value = util.prettifyNumber(500000);
      expect(value).toEqual('500,000');
    });
    
    it("should format numbers in scientific notation", function() {
      value = util.prettifyNumber(1e24);
      expect(value).toEqual('1 &#215; 10<sup>24</sup>');
    });
  });
  
  describe('versionCompare', function() {
    it("should return undefined if both are non strings", function() {
      value = util.versionCompare(1,3);
      expect(value).toBeUndefined();
    });
    
    it("should return undefined if the first argument non strings", function() {
      value = util.versionCompare(1,"3.0");
      expect(value).toBeUndefined();
    });
    
    it("should return undefined if the second argument non strings", function() {
      value = util.versionCompare("1.0",3);
      expect(value).toBeUndefined();
    });
        
    it("should return bigger if the first argument is bigger", function() {
      value = util.versionCompare("3","1");
      expect(value).toEqual('bigger');
    });
    
    it("should return smaller if the second argument is bigger", function() {
      value = util.versionCompare("1.32","3.0");
      expect(value).toEqual('smaller');
    });
        
    it("should return smaller if the second argument is bigger 2", function() {
      value = util.versionCompare("3.0","3.0.1");
      expect(value).toEqual('smaller');
    });
    
    it("should return equal if both arguments are equal", function() {
      value = util.versionCompare("3","3");
      expect(value).toEqual('equal');
    });
    
    it("should return work with several version formats", function() {
      value = util.versionCompare("3.2.3","3.2.2");
      expect(value).toEqual('bigger');
    });
    
    it("should return work with different lengths", function() {
      value = util.versionCompare("3.2.3.1","3.2.3");
      expect(value).toEqual('bigger');
    });
  });

  describe('visibleKeys', function() {    
    it("should return only the values that are visible", function() {
      map = {}
      map["a"] = {visible:function(){return true;}}      
      map["f"] = {visible:function(){return false;}}      
      map["e"] = {visible:function(){return true;}}       
      map["s"] = {visible:function(){return false;}}      
      map["b"] = {visible:function(){return true;}}
      
      result = util.visibleKeys(map);
      
      expect(result).toEqual(["a","e","b"]);
    });
    
    it("should return an empty list for an empty map", function() {
      map = {}
      
      result = util.visibleKeys(map);
      
      expect(result).toEqual([]);
    });
    
    it("should return an empty list if no elements are visible", function() {
      map = {}
      map["a"] = {visible:function(){return false;}}      
      map["f"] = {visible:function(){return false;}}
      
      result = util.visibleKeys(map);
      
      expect(result).toEqual([]);
    });
  });

  describe('misc functions', function() {
    it("should return globally defined HTML code", function() {
      value = util.getHTML('beta-');
      
      expect(value).toEqual('&#946;<sup>-</sup>');
    });
    
    it("should return resource defined HTML code", function() {
      value = util.getHTML('2H');
      
      expect(value).toEqual('<sup>2</sup>H');
    });
    
    it("should return resources that don't have defined HTML code", function() {
      value = util.getHTML('p');
      
      expect(value).toEqual('p');
    });
  });
});