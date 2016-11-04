describe("Incremental table elements", function() {
  beforeEach(module('incremental'));

  var $controller;
  var $rootScope;
  var $timeout;
  
  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    spyOn($rootScope, '$emit').and.callThrough();
    $timeout = _$timeout_;
  }));

  describe('prettifyNumber', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });

    it("should return inifinity as a symbol", function() {
      value = $scope.prettifyNumber(Infinity);
      expect(value).toEqual("&infin;");
    });
    
    it("should return empty string as a empty", function() {
      value = $scope.prettifyNumber('');
      expect(value).toEqual('');
    });
    
    it("should return undefined as undefined", function() {
      value = $scope.prettifyNumber(undefined);
      expect(value).toBeUndefined();
    });
    
    it("should leave small numbers unchanged", function() {
      value = $scope.prettifyNumber(1);
      expect(value).toEqual('1');
    });
    
    it("should format numbers with group separation commas", function() {
      value = $scope.prettifyNumber(500000);
      expect(value).toEqual('500,000');
    });
    
    it("should format numbers in scientific notation", function() {
      value = $scope.prettifyNumber(1e24);
      expect(value).toEqual('1 &#215; 10<sup>24</sup>');
    });
  });
  
  describe('versionCompare', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });    
    
    it("should return undefined if both are non strings", function() {
      value = controller.versionCompare(1,3);
      expect(value).toBeUndefined();
    });
    
    it("should return undefined if the first argument non strings", function() {
      value = controller.versionCompare(1,"3.0");
      expect(value).toBeUndefined();
    });
    
    it("should return undefined if the second argument non strings", function() {
      value = controller.versionCompare("1.0",3);
      expect(value).toBeUndefined();
    });
        
    it("should return bigger if the first argument is bigger", function() {
      value = controller.versionCompare("3","1");
      expect(value).toEqual('bigger');
    });
    
    it("should return smaller if the second argument is bigger", function() {
      value = controller.versionCompare("1.32","3.0");
      expect(value).toEqual('smaller');
    });
        
    it("should return smaller if the second argument is bigger 2", function() {
      value = controller.versionCompare("3.0","3.0.1");
      expect(value).toEqual('smaller');
    });
    
    it("should return equal if both arguments are equal", function() {
      value = controller.versionCompare("3","3");
      expect(value).toEqual('equal');
    });
    
    it("should return work with several version formats", function() {
      value = controller.versionCompare("3.2.3","3.2.2");
      expect(value).toEqual('bigger');
    });
    
    it("should return work with different lengths", function() {
      value = controller.versionCompare("3.2.3.1","3.2.3");
      expect(value).toEqual('bigger');
    });
  });
  
    
  describe('toast functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    }); 
            
    it("should add toasts to an empty queue", function() {
      $scope.toast = [];
      $scope.is_toast_visible = false;
      $scope.addToast('test');
      
      expect($scope.toast.length).toEqual(1);
      expect($scope.toast[0]).toEqual('test');
      expect($scope.is_toast_visible).toBeTruthy();
    });
    
    it("should add toasts to an non empty queue", function() {
      $scope.toast = ['a'];
      $scope.addToast('test');
      
      expect($scope.toast.length).toEqual(2);
      expect($scope.toast[1]).toEqual('test');
    });
    
    it("should not change the visibility of non empty queue", function() {
      $scope.toast = ['a'];
      $scope.is_toast_visible = false;
      $scope.addToast('test');
      
      expect($scope.is_toast_visible).toBeFalsy();
    });  
    
    it("should remove toasts", function() {
      $scope.toast = ['test'];
      $scope.is_toast_visible = true;
      $scope.removeToast();
      
      expect($scope.is_toast_visible).toBeFalsy();
    });
    
    it("should not flip the visibility when removing toasts", function() {
      $scope.toast = ['test'];
      $scope.is_toast_visible = false;
      $scope.removeToast();
      
      expect($scope.is_toast_visible).toBeFalsy();
    });
    
    it("should not fail on empty toast queues", function() {
      $scope.toast = [];
      $scope.is_toast_visible = true;
      $scope.removeToast();
      
      expect($scope.is_toast_visible).toBeFalsy();
    });
    
    it("should delete toasts", function() {
      $scope.toast = ['test'];
      controller.deleteToast();
      
      expect($scope.toast).toEqual([]);
    });
    
    it("should shift toasts", function() {
      $scope.toast = ['test','test2'];
      controller.deleteToast();
      
      expect($scope.toast).toEqual(['test2']);
    });
    
    it("should make upcoming toasts visible", function() {
      $scope.toast = ['test','test2'];
      $scope.is_toast_visible = false;
      controller.deleteToast();
      
      expect($scope.is_toast_visible).toBeTruthy();
    });
    
    it("should not fail on delete empty lists", function() {
      $scope.toast = [];
      controller.deleteToast();
      
      expect($scope.toast).toEqual([]);
    });
  });
  
  describe('intro animation', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      controller = $controller('IncCtrl', {$scope:$scope});
      $scope.player = {};
      $scope.player.intro = {};
    });
        
    it("should call all steps while playing the intro", function() {
      $scope.player.intro['banner'] = false;
      $scope.player.intro['menu'] = false;
      $scope.player.intro['content'] = false;
      
      controller.introAnimation();
      
      // we need this to simplify the test
      $timeout.cancel(controller.onload);
      $timeout.flush();
      
      expect($scope.player.intro['banner']).toBeTruthy();
      expect($scope.player.intro['menu']).toBeTruthy();
      expect($scope.player.intro['content']).toBeTruthy();
    });
        
    it("should take a step", function() {
      $scope.player.intro['banner'] = false;
      
      controller.introStep('banner');
      
      expect($scope.player.intro['banner']).toBeTruthy();
    });
    
    it("should not flip other states", function() {
      $scope.player.intro['menu'] = false;
      $scope.player.intro['content'] = true;
      
      controller.introStep('banner');
      
      expect($scope.player.intro['menu']).toBeFalsy();
      expect($scope.player.intro['content']).toBeTruthy();
    });
  });
  
  describe('filterVisible', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    }); 
    
    it("should return only the values that are visible", function() {
      map = {}
      map["a"] = {visible:function(){return true;}}      
      map["f"] = {visible:function(){return false;}}      
      map["e"] = {visible:function(){return true;}}       
      map["s"] = {visible:function(){return false;}}      
      map["b"] = {visible:function(){return true;}}
      
      result = $scope.keys($scope.visible(map));
      
      expect(result).toEqual(["a","e","b"]);
    });
    
    it("should return an empty list for an empty map", function() {
      map = {}
      
      result = $scope.keys($scope.visible(map));
      
      expect(result).toEqual([]);
    });
    
    it("should return an empty list if no elements are visible", function() {
      map = {}
      map["a"] = {visible:function(){return false;}}      
      map["f"] = {visible:function(){return false;}}
      
      result = $scope.keys($scope.visible(map));
      
      expect(result).toEqual([]);
    });
  });
  
  describe('achievements', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });  
    
    it("should initialise the listeners of the locked achievements", function() {
      // create a dummy achievement only for test purposes
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["test"] = false;
      $scope.unlocks = {};
      $scope.unlocks["test"] = {check:function(event,data){},event:"cycle"};
    
      controller.initializeListeners();
      
      expect($scope.unlocks["test"].listener).not.toBeUndefined();
    });
      
    it("should not initialise the listeners of the unlocked achievements", function() {
      // create a dummy achievement only for test purposes
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["test"] = true;
      $scope.unlocks = {};
      $scope.unlocks["test"] = {check:function(event,data){},event:"cycle"};
    
      controller.initializeListeners();
      
      expect($scope.unlocks["test"].listener).toBeUndefined();
    });   
    
    it("should stop running listeners", function() {
      // create a dummy achievement only for test purposes
      $scope.unlocks = {};
      $scope.unlocks["test"] = {listener:$scope.$on("cycle",null)};
    
      controller.stopListeners();
      
      expect($scope.unlocks["test"].listener).toBeUndefined();
    });
    
    it("should not start stopped listeners", function() {
      // create a dummy achievement only for test purposes
      $scope.unlocks = {};
      $scope.unlocks["test"] = {};
    
      controller.stopListeners();
      
      expect($scope.unlocks["test"].listener).toBeUndefined();
    });
    
    it("should emit a cycle event", function() {    
      controller.checkUnlocks();
      
			expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should return for undefined player when counting total achievements", function() {
      value = $scope.numberUnlocks();
      
      expect(value).toBeUndefined();
    });
    
    it("should return for undefined player when counting unlocked achievements", function() {
      value = $scope.numberUnlocked();
      
      expect(value).toBeUndefined();
    });    
    
    it("should count the number of achievements", function() {
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["test"] = true;      
      $scope.player.unlocks["test2"] = false;
      
      value = $scope.numberUnlocks();
      
      expect(value).toEqual(2);
    });
    
    it("should count the number of achievements unlocked", function() {
      $scope.player = {unlocks:{}};
      $scope.player.unlocks["test"] = true;      
      $scope.player.unlocks["test2"] = false;
      
      value = $scope.numberUnlocked();
      
      expect(value).toEqual(1);
    });
  });
  
  describe('initialization functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should init all the variables", function() {
      spyOn(controller, "populatePlayer");
      
      controller.init();
      
			expect($scope.current_tab).toEqual("Elements");
			expect($scope.current_entry).toEqual("Hydrogen");
			expect($scope.current_element).toEqual("H");
			expect($scope.hover_element).toEqual("");
			expect($scope.toast).toEqual([]);
			expect($scope.is_toast_visible).toBeFalsy();
			expect(controller.populatePlayer).toHaveBeenCalled();
    });
  });
  
  describe('misc functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    }); 
    
    it("should catch resource event", function() {
      $scope.player = {resources:{}};
      $scope.player.resources['H'] = {unlocked:false}
      $scope.$emit("resource","H");    
      
      controller.checkUnlocks();
      
      expect($scope.player.resources['H'].unlocked).toBeTruthy();
    });

    it("should return globally defined HTML code", function() {
      $scope.html = {'beta-':'&#946;<sup>-</sup>'}
      $scope.resources = {}      
      
      value = $scope.getHTML('beta-');
      
      expect(value).toEqual('&#946;<sup>-</sup>');
    });
    
    it("should return resource defined HTML code", function() {
      $scope.html = {}
      $scope.resources = {}    
      $scope.resources['2H'] = {html:'<sub>2</sub>H'}
      
      value = $scope.getHTML('2H');
      
      expect(value).toEqual('<sub>2</sub>H');
    });
    
    it("should return resources that don't have defined HTML code", function() {
      $scope.html = {};
      $scope.resources = {'eV':{}} 
      
      value = $scope.getHTML('eV');
      
      expect(value).toEqual('eV');
    });
  });
  
  describe('onload', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new();
      
      controller = $controller('IncCtrl', {$scope:$scope});
    
      spyOn(window, "loadData");
			spyOn($scope, "load");
			spyOn(controller, "init");
			spyOn(controller, "introAnimation");
			spyOn(controller, "initializeListeners");
      spyOn($scope, "updateTheme");
    });
    
    it("should load the game", function() {
      spyOn(localStorage, "getItem");
      
      // flush onload
      $timeout.flush();
      
			expect($scope.load).not.toHaveBeenCalled();
			expect(loadData).toHaveBeenCalled();
			expect(localStorage.getItem).toHaveBeenCalled();
			expect(controller.init).toHaveBeenCalled();
			expect(controller.introAnimation).toHaveBeenCalled();
			expect(controller.initializeListeners).toHaveBeenCalled();
			expect($scope.lastSave).toEqual("None");
    });
    
    it("should load the player", function() {
      spyOn(localStorage, "getItem").and.returnValue("");
    
      // flush onload
      $timeout.flush();
      
			expect($scope.load).toHaveBeenCalled();
    });
    
    it("should not init if the player exists", function() {
      $scope.player = "";
    
      // flush onload
      $timeout.flush();
      
			expect(controller.init).not.toHaveBeenCalled();
    });
    
    it("should not overwrite lastSave", function() {
      $scope.lastSave = "test";
    
      // flush onload
      $timeout.flush();
      
			expect($scope.lastSave).toEqual("test");
    });
  });
  
  describe('save and load', function() {
    var $scope, controller;
    var getItemSpy
    
    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
      
      getItemSpy = spyOn(localStorage, "getItem");
      spyOn(localStorage, "setItem");
      spyOn(localStorage, "removeItem");
    });
    
    it("should save player data", function() {
      $scope.lastSave = undefined;
    
      $scope.save();
      
      expect($scope.lastSave).not.toBeUndefined();
			expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("should load player data", function() {
      localStorage.getItem.isSpy = false;
      getItemSpy.and.returnValue('{}');
      $scope.lastSave = undefined;
      spyOn($scope, "reset");
      spyOn(controller, "versionControl");
    
      $scope.load();
      
			expect(localStorage.getItem).toHaveBeenCalled();
      expect($scope.reset).not.toHaveBeenCalled();
      expect(controller.versionControl).toHaveBeenCalled();
    });
    
    it("should load player data and throw exception", function() {
      $scope.lastSave = undefined;
      spyOn($scope, "reset");
      spyOn(controller, "versionControl");
    
      $scope.load();
      
			expect(localStorage.getItem).toHaveBeenCalled();
      expect($scope.reset).toHaveBeenCalled();
      expect(controller.versionControl).toHaveBeenCalled();
    });
    
    it("should reset player without confirmation", function() {
      $scope.lastSave = undefined;
      spyOn(controller, "init");
      spyOn(controller, "introAnimation");
      spyOn($scope, "updateTheme");
    
      $scope.reset(false);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(controller.init).toHaveBeenCalled();
      expect(controller.introAnimation).toHaveBeenCalled();
    });
    
    it("should reset player with confirmation", function() {
      $scope.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(true);
      spyOn(controller, "init");
      spyOn(controller, "introAnimation");
      spyOn($scope, "updateTheme");
    
      $scope.reset(true);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(controller.init).toHaveBeenCalled();
      expect(controller.introAnimation).toHaveBeenCalled();
    });
    
    it("should not reset player if the confirmation rejets", function() {
      $scope.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(false);
      spyOn(controller, "init");
      spyOn(controller, "introAnimation");
    
      $scope.reset(true);

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(controller.init).not.toHaveBeenCalled();
      expect(controller.introAnimation).not.toHaveBeenCalled();
    });
        
    it("should export save", function() {
      spyOn(window, "btoa").and.returnValue("");
    
      $scope.exportSave();

      expect(window.btoa).toHaveBeenCalled();
    });

    it("should import save", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(window, "atob").and.returnValue("{}");
      spyOn(controller, "stopListeners");
      spyOn(controller, "versionControl");
      spyOn($scope, "save");
      spyOn($scope, "updateTheme");
      spyOn(controller, "initializeListeners");
    
      $scope.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(controller.stopListeners).toHaveBeenCalled();
      expect(controller.versionControl).toHaveBeenCalled();
      expect($scope.save).toHaveBeenCalled();
      expect($scope.updateTheme).toHaveBeenCalled();
      expect(controller.initializeListeners).toHaveBeenCalled();
    });
    
    it("should not import if save is not presented", function() {
      spyOn(window, "prompt").and.returnValue("");
      spyOn(window, "atob").and.returnValue("{}");
      spyOn(controller, "stopListeners");
      spyOn(controller, "versionControl");
      spyOn($scope, "save");
      spyOn($scope, "updateTheme");
      spyOn(controller, "initializeListeners");
    
      $scope.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).not.toHaveBeenCalled();
      expect(controller.stopListeners).not.toHaveBeenCalled();
      expect(controller.versionControl).not.toHaveBeenCalled();
      expect($scope.save).not.toHaveBeenCalled();
      expect($scope.updateTheme).not.toHaveBeenCalled();
      expect(controller.initializeListeners).not.toHaveBeenCalled();
    });
    
    it("should not import if save is invalid", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(window, "atob");
      spyOn(controller, "stopListeners");
      spyOn(controller, "versionControl");
      spyOn($scope, "save");
      spyOn($scope, "updateTheme");
      spyOn(controller, "initializeListeners");
    
      $scope.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(controller.stopListeners).not.toHaveBeenCalled();
      expect(controller.versionControl).not.toHaveBeenCalled();
      expect($scope.save).not.toHaveBeenCalled();
      expect($scope.updateTheme).not.toHaveBeenCalled();
      expect(controller.initializeListeners).not.toHaveBeenCalled();
    });
      
    it("should version control", function() {
      controller.versionControl();
    });
  });
    
  describe('formatting functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should format reactions", function() {
      $scope.html = {energy:'eV'};
      $scope.resources = {};
      $scope.resources['H2'] = {html:'H<sub>2</sub>'}
      $scope.resources['H-'] = {html:'H<sup>-</sup>'}
      $scope.resources['p'] = {}
      
			reaction = {
        reactant:{
          'H-':1,
          'p':1
        },
        product:{
          'H2':1,
          'energy':17.3705
        }
      }
      
      value = $scope.reactionFormat(1, reaction);
      
      expect(value).toEqual('H<sup>-</sup> + p <span class=\"icon\">&#8594;</span> H<sub>2</sub> + 17.3705 eV');
    });
      
    it("should format multiple reactions", function() {
      $scope.html = {energy:'eV'};
      $scope.resources = {};
      $scope.resources['H2'] = {html:'H<sub>2</sub>'}
      $scope.resources['H-'] = {html:'H<sup>-</sup>'}
      $scope.resources['p'] = {}
      
			reaction = {
        reactant:{
          'H-':1,
          'p':1
        },
        product:{
          'H2':1,
          'energy':17.3705
        }
      }
      
      value = $scope.reactionFormat(10, reaction);
      
      expect(value).toEqual('10 H<sup>-</sup> + 10 p <span class=\"icon\">&#8594;</span> 10 H<sub>2</sub> + 173.705 eV');
    });
    
    it("should format single compounds", function() {
      $scope.html = {energy:'eV'};
      $scope.resources = {};
      $scope.resources['H2'] = {html:'H<sub>2</sub>'}
      
			product={
				'H2':1,
				'energy':17.3705
			}
      
      value = $scope.compoundFormat(1, product);
      
      expect(value).toEqual('H<sub>2</sub> + 17.3705 eV');
    });
    
    it("should format mutiple compounds", function() {
      $scope.html = {energy:'eV'};
      $scope.resources = {};
      $scope.resources['H2'] = {html:'H<sub>2</sub>'}
			product={
				'H2':1,
				'energy':17.3705
			}
      
      value = $scope.compoundFormat(10, product);
      
      expect(value).toEqual('10 H<sub>2</sub> + 173.705 eV');
    });
  
    it("should format decay", function() {
      $scope.html = {energy:'eV'};
      $scope.resources = {};
      $scope.resources['3He+1'] = {html:'3He<sup>+</sup>'}
      $scope.resources['e-'] = {}
      decay = {
						half_life:3.8852e+8,
						decay_energy:18610,
						decay_type:'beta-',
						decay_product:{'3He+1':1,'e-':1}
					}
    
      value = $scope.decayFormat(decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span>3He<sup>+</sup> + e- + 18,610 eV');
    }); 
    
    it("should format decay without energy", function() {
      $scope.html = {};
      $scope.resources = {};
      $scope.resources['3He+1'] = {html:'3He<sup>+</sup>'}
      $scope.resources['e-'] = {}
      decay = {
						half_life:3.8852e+8,
						decay_type:'beta-',
						decay_product:{'3He+1':1,'e-':1}
					}
    
      value = $scope.decayFormat(decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span>3He<sup>+</sup> + e-');
    });
  });
    
  describe('prices and cost', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should calculate element price", function() {  
      $scope.player = {};
      $scope.player.elements_unlocked = 1;
      $scope.elements = {'O':{}};
      $scope.elements['O'].order = 8;
    
      value = $scope.elementPrice('O');
      
      expect(value).toEqual(256);
    });   
    
    it("should calculate element price 2", function() {
      $scope.player = {};
      $scope.player.elements_unlocked = 5;
      $scope.elements = {'Sn':{}};
      $scope.elements['Sn'].order = 50;
    
      value = $scope.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(8.0828128e+38.toPrecision(6),6);
    });
    
    it("should check if the cost of an element is met", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['e-'] = {number:0};
			$scope.player.resources['p'] = {number:300};
			$scope.player.resources['n'] = {number:300};
      spyOn($scope,'elementPrice').and.returnValue(256);
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toBeFalsy();
    });    
    
    it("should check if the cost of an element is met 2", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['e-'] = {number:300};
			$scope.player.resources['p'] = {number:0};
			$scope.player.resources['n'] = {number:300};
      spyOn($scope,'elementPrice').and.returnValue(256);
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toBeFalsy();
    }); 
    
    it("should check if the cost of an element is met 3", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['e-'] = {number:300};
			$scope.player.resources['p'] = {number:300};
			$scope.player.resources['n'] = {number:0};
      spyOn($scope,'elementPrice').and.returnValue(256);
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toBeFalsy();
    });
        
    it("should check if the cost of an element is met 4", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['e-'] = {number:300};
			$scope.player.resources['p'] = {number:300};
			$scope.player.resources['n'] = {number:300};
      spyOn($scope,'elementPrice').and.returnValue(256);
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toBeTruthy();
    });
    
    it("should check if the cost of a synthesis is met", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:0};
			$scope.player.resources['eV'] = {number:10};
      spyOn($scope,'synthesisPrice').and.returnValue({'H':1,'eV':10});
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isSynthesisCostMet('H', reaction);
      
      expect(value).toBeFalsy();
    });  
    
    it("should check if the cost of a synthesis is met 2", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:2};
			$scope.player.resources['eV'] = {number:5};
      spyOn($scope,'synthesisPrice').and.returnValue({'H':1,'eV':10});
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isSynthesisCostMet('H', reaction);
      
      expect(value).toBeFalsy();
    });
    
    it("should check if the cost of a synthesis is met 3", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:2};
			$scope.player.resources['eV'] = {number:10};
      spyOn($scope,'synthesisPrice').and.returnValue({'H':1,'eV':10});
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isSynthesisCostMet('H', reaction);
      
      expect(value).toBeTruthy();
    });
    
    it("should check if the cost of a reaction is met", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:0};
			$scope.player.resources['eV'] = {number:10};
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isReactionCostMet(1, reaction);
      
      expect(value).toBeFalsy();
    });   
    
    it("should check if the cost of a reaction is met 2", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:5};
			$scope.player.resources['eV'] = {number:5};
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isReactionCostMet(1, reaction);
      
      expect(value).toBeFalsy();
    });
    
    it("should check if the cost of a reaction is met 3", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:50};
			$scope.player.resources['eV'] = {number:50};
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isReactionCostMet(10, reaction);
      
      expect(value).toBeFalsy();
    });
    
    it("should check if the cost of a reaction is met 4", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:5};
			$scope.player.resources['eV'] = {number:50};
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isReactionCostMet(1, reaction);
      
      expect(value).toBeTruthy();
    });  
    
    it("should check if the cost of a reaction is met 5", function() {  
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H'] = {number:50};
			$scope.player.resources['eV'] = {number:500};
    	
      reaction = {
        reactant:{
          'H':1,
          'eV':10
        },
        product:{
          'H2':1,
          'eV':17.3705
        }
      }
      
      value = $scope.isReactionCostMet(10, reaction);
      
      expect(value).toBeTruthy();
    });
    
    it("should return the price of a generator", function() {  
      $scope.player = {};
      $scope.player.elements = {'H':{}};
      $scope.player.elements['H'] = {'generators':{}};
      $scope.player.elements['H'].generators['Tier 1'] = {'level':5};
      $scope.generators = {'Tier 1':{}};
      $scope.generators['Tier 1'].price = 15;
      $scope.generators['Tier 1'].priceIncrease = 1.05;
    
      value = $scope.generatorPrice('Tier 1','H');
      
      expect(value).toEqual(20);
    });
    
    it("should return the price of a generator 2", function() {  
      $scope.player = {};
      $scope.player.elements = {'H':{}};
      $scope.player.elements['H'] = {'generators':{}};
      $scope.player.elements['H'].generators['Tier 3'] = {'level':10};
      $scope.generators = {'Tier 3':{}};
      $scope.generators['Tier 3'].price = 1100;
      $scope.generators['Tier 3'].priceIncrease = 1.1;
    
      value = $scope.generatorPrice('Tier 3','H');
      
      expect(value).toEqual(2854);
    });
    
    it("should return the price of a synthesis", function() {  
      $scope.synthesis = {'H2O':{}};
      $scope.synthesis['H2O'] = {
        reactant:{
          'H2':1,
          'O2':1
        },
        product:{
          'H2O':1,
          'O':1
        }
      }
      spyOn($scope,'synthesisMultiplier').and.returnValue(2);
    
      value = $scope.synthesisPrice('H','H2O');
      
      expect(value).toEqual({'H2':2,'O2':2});
    });
    
    it("should return the las tier upgrade price", function() {  
      $scope.generators = {'Tier 1':{}};
      $scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      $scope.player = {elements:{}};
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades['Tier 1-1'] = {bought:true};      
      $scope.player.elements['H'].upgrades['Tier 1-2'] = {bought:true};
      $scope.player.elements['H'].upgrades['Tier 1-3'] = {bought:false};
      $scope.current_element = 'H';
      $scope.upgrades = {};
      $scope.upgrades['Tier 1-3'] = {price:1001};
    
      value = $scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toEqual(1001);
    });    
    
    it("should return null if all upgrades are bought", function() {  
      $scope.generators = {'Tier 1':{}};
      $scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      $scope.player = {elements:{}};
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades['Tier 1-1'] = {bought:true};      
      $scope.player.elements['H'].upgrades['Tier 1-2'] = {bought:true};
      $scope.player.elements['H'].upgrades['Tier 1-3'] = {bought:true};
      $scope.current_element = 'H';
      $scope.upgrades = {};
      $scope.upgrades['Tier 1-3'] = {price:1001};
    
      value = $scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toBeNull();
    });
  });
  
  describe('purchase functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should purchase element if cost is met", function() {      
      spyOn($scope,'isElementCostMet').and.returnValue(true);    
      spyOn($scope,'elementPrice').and.returnValue(256);
      $scope.player = {elements:{},resources:{},elements_unlocked:2};
      $scope.player.resources['e-'] = {number:256};
      $scope.player.resources['p'] = {number:257};
      $scope.player.resources['n'] = {number:258};
      $scope.player.elements['O'] = {unlocked:false,generators:{}};
      $scope.player.elements['O'].generators["Tier 1"] = {level:0};
      
      $scope.buyElement('O');
      
      expect($scope.player.resources['e-'].number).toEqual(0);
      expect($scope.player.resources['p'].number).toEqual(1);
      expect($scope.player.resources['n'].number).toEqual(2);
      expect($scope.player.elements['O'].unlocked).toBeTruthy();
      expect($scope.player.elements['O'].generators["Tier 1"].level).toEqual(1);
      expect($scope.player.elements_unlocked).toEqual(3);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase element if cost is not met", function() {  
      spyOn($scope,'isElementCostMet').and.returnValue(false);    
      spyOn($scope,'elementPrice').and.returnValue(333);
      $scope.player = {elements:{},resources:{},elements_unlocked:2};
      $scope.player.resources['e-'] = {number:256};
      $scope.player.resources['p'] = {number:257};
      $scope.player.resources['n'] = {number:258};
      $scope.player.elements['O'] = {unlocked:false,generators:{}};
      $scope.player.elements['O'].generators["Tier 1"] = {level:0};
      
      $scope.buyElement('O');
      
      expect($scope.player.resources['e-'].number).toEqual(256);
      expect($scope.player.resources['p'].number).toEqual(257);
      expect($scope.player.resources['n'].number).toEqual(258);
      expect($scope.player.elements['O'].unlocked).toBeFalsy();
      expect($scope.player.elements['O'].generators["Tier 1"].level).toEqual(0);
      expect($scope.player.elements_unlocked).toEqual(2);
      expect($scope.$emit).not.toHaveBeenCalled();
    }); 
    
    it("should skip if the element is already purchased", function() {
      spyOn($scope,'isElementCostMet');
      $scope.player = {elements:{}};
      $scope.player.elements['O'] = {unlocked:true};   

      $scope.buyElement('O');
      
      expect($scope.isElementCostMet).not.toHaveBeenCalled();
    });
    
    it("should purchase an upgrade if cost is met", function() {      
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades["Tier 1-1"] = {bought:false};
      $scope.upgrades = {'Tier 1-1':{}};
      $scope.upgrades['Tier 1-1'].price = 5;
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect($scope.player.resources['H'].number).toEqual(5);
      expect($scope.player.elements['H'].upgrades["Tier 1-1"].bought).toBeTruthy();
    });
    
    it("should not purchase an upgrade if cost is not met", function() {      
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades["Tier 1-1"] = {bought:false};
      $scope.upgrades = {'Tier 1-1':{}};
      $scope.upgrades['Tier 1-1'].price = 15;
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.elements['H'].upgrades["Tier 1-1"].bought).toBeFalsy();
    });
    
    it("should skip if the upgrade is already bought", function() {
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades["Tier 1-1"] = {bought:true};
      $scope.upgrades = {'Tier 1-1':{}};
      $scope.upgrades['Tier 1-1'].price = 5;
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.elements['H'].upgrades["Tier 1-1"].bought).toBeTruthy();
    });  
                
    it("should purchase as many generators as requested", function() {
      spyOn($scope,'generatorPrice').and.returnValues(5,6,7,8);
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:30};
      $scope.player.elements['H'] = {generators:{}};
      $scope.player.elements['H'].generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',3);
      
      expect($scope.player.resources['H'].number).toEqual(12);
      expect($scope.player.elements['H'].generators["Tier 1"].level).toEqual(8);
      expect($scope.$emit).toHaveBeenCalled();
    });    
    
    it("should purchase as many generators as possible until money runs out requested", function() {
      spyOn($scope,'generatorPrice').and.returnValues(5,6,7);
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:12};
      $scope.player.elements['H'] = {generators:{}};
      $scope.player.elements['H'].generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',3);
      
      expect($scope.player.resources['H'].number).toEqual(1);
      expect($scope.player.elements['H'].generators["Tier 1"].level).toEqual(7);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase negative generators", function() {
      spyOn($scope,'generatorPrice').and.returnValue(5);
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.elements['H'] = {generators:{}};
      $scope.player.elements['H'].generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',-10);
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.elements['H'].generators["Tier 1"].level).toEqual(5);
      expect($scope.$emit).not.toHaveBeenCalled();
    });
    
    it("should not purchase generator if cost is not met", function() {
      spyOn($scope,'generatorPrice').and.returnValue(20);
      $scope.player = {elements:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.elements['H'] = {generators:{}};
      $scope.player.elements['H'].generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',10);
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.elements['H'].generators["Tier 1"].level).toEqual(5);
      expect($scope.$emit).not.toHaveBeenCalled();
    });    
    
    it("should purchase as many synthesis as requested", function() {
      spyOn($scope,'isSynthesisCostMet').and.returnValues(true,true,true,true);
      spyOn($scope,'synthesisPrice').and.returnValues({'H':2,'e-':1},{'H':4,'e-':2},{'H':8,'e-':3},{'H':16,'e-':4});
      $scope.player = {synthesis:{},resources:{}};
      $scope.player.resources['H'] = {number:32};
      $scope.player.resources['e-'] = {number:32};
      $scope.player.synthesis['He-'] = {number:1};
      
      $scope.buySynthesiss("H",'He-',3);
      
      expect($scope.player.resources['H'].number).toEqual(18);
      expect($scope.player.resources['e-'].number).toEqual(26);
      expect($scope.player.synthesis['He-'].number).toEqual(4);
      //expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should purchase as many synthesis as possible", function() {
      spyOn($scope,'isSynthesisCostMet').and.returnValues(true,true,false,false);
      spyOn($scope,'synthesisPrice').and.returnValues({'H':2,'e-':1},{'H':4,'e-':2},{'H':8,'e-':3},{'H':16,'e-':4});
      $scope.player = {synthesis:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.resources['e-'] = {number:32};
      $scope.player.synthesis['He-'] = {number:1};
      
      $scope.buySynthesiss("H",'He-',3);
      
      expect($scope.player.resources['H'].number).toEqual(4);
      expect($scope.player.resources['e-'].number).toEqual(29);
      expect($scope.player.synthesis['He-'].number).toEqual(3);
      //expect($scope.$emit).toHaveBeenCalled();
    });  
    
    it("should not purchase negative synthesis", function() {
      spyOn($scope,'isSynthesisCostMet').and.returnValues(true,true,false,false);
      spyOn($scope,'synthesisPrice').and.returnValues({'H':2,'e-':1},{'H':4,'e-':2},{'H':8,'e-':3},{'H':16,'e-':4});
      $scope.player = {synthesis:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.resources['e-'] = {number:32};
      $scope.player.synthesis['He-'] = {number:1};
      
      $scope.buySynthesiss("H",'He-',-3);
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.resources['e-'].number).toEqual(32);
      expect($scope.player.synthesis['He-'].number).toEqual(1);
      //expect($scope.$emit).toHaveBeenCalled();
    });   
    
    it("should not purchase synthesis if the cost is not met", function() {
      spyOn($scope,'isSynthesisCostMet').and.returnValues(false);
      spyOn($scope,'synthesisPrice').and.returnValues({'H':2,'e-':1});
      $scope.player = {synthesis:{},resources:{}};
      $scope.player.resources['H'] = {number:10};
      $scope.player.resources['e-'] = {number:32};
      $scope.player.synthesis['He-'] = {number:1};
      
      $scope.buySynthesiss("H",'He-',-3);
      
      expect($scope.player.resources['H'].number).toEqual(10);
      expect($scope.player.resources['e-'].number).toEqual(32);
      expect($scope.player.synthesis['He-'].number).toEqual(1);
      //expect($scope.$emit).toHaveBeenCalled();
    });
  });
  
  describe('production functions', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should calculate the generator production", function() {
      $scope.generators = {'Tier 1':{}};
      $scope.generators['Tier 1'].power = 10;
      $scope.generators['Tier 1'].upgrades = ['1','2','3'];
      $scope.player = {'elements':{}};      
      $scope.player.elements['H'] = {upgrades:{}};
      $scope.player.elements['H'].upgrades['1'] = {bought:true};
      $scope.player.elements['H'].upgrades['2'] = {bought:true};
      $scope.player.elements['H'].upgrades['3'] = {bought:false};
      $scope.upgrades = {};
      $scope.upgrades['1'] = {apply:function(prod){return prod*2;}};
      $scope.upgrades['2'] = {apply:function(prod){return prod*3;}};
    
      value = $scope.generatorProduction('Tier 1','H');
      
      expect(value).toEqual(60);
    });
    
    it("should calculate the tier production", function() {
      $scope.generators = {'Tier 1':{}};
      $scope.generators['Tier 1'].power = 10;
      $scope.generators['Tier 1'].upgrades = ['1','2','3'];
      $scope.player = {'elements':{}};      
      $scope.player.elements['H'] = {upgrades:{},generators:{}};
      $scope.player.elements['H'].generators['Tier 1'] = {level:5};
      $scope.player.elements['H'].upgrades['1'] = {bought:true};
      $scope.player.elements['H'].upgrades['2'] = {bought:true};
      $scope.player.elements['H'].upgrades['3'] = {bought:false};
      $scope.upgrades = {};
      $scope.upgrades['1'] = {apply:function(prod){return prod*2;}};
      $scope.upgrades['2'] = {apply:function(prod){return prod*3;}};
    
      value = $scope.tierProduction('Tier 1','H');
      
      expect(value).toEqual(300);
    });    
    
    it("should calculate the element production", function() {
      $scope.generators = {'Tier 1':{},'Tier 2':{},'Tier 3':{}};
      spyOn($scope,'tierProduction').and.returnValues(1,10,100);
    
      value = $scope.elementProduction('H');
      
      expect(value).toEqual(111);
    });
  });
    
  describe('react', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should react the number specified", function() {
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H2'] = {number:50};
      $scope.player.resources['O2'] = {number:25};
			$scope.player.resources['H2O'] = {number:0};
			$scope.player.resources['O'] = {number:1};
      spyOn($scope,'isReactionCostMet').and.returnValue(true);
    	
      reaction = {
        reactant:{
          'H2':1,
          'O2':1
        },
        product:{
          'H2O':2,
          'O':1
        }
      }
      
      $scope.react(10,reaction);
      
      expect($scope.player.resources['H2'].number).toEqual(40);
      expect($scope.player.resources['O2'].number).toEqual(15);
      expect($scope.player.resources['H2O'].number).toEqual(20);
      expect($scope.player.resources['O'].number).toEqual(11);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should return if the number specified is invalid", function() {
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H2'] = {number:50};
      $scope.player.resources['O2'] = {number:25};
			$scope.player.resources['H2O'] = {number:0};
			$scope.player.resources['O'] = {number:1};
      spyOn($scope,'isReactionCostMet').and.returnValue(true);
    	
      reaction = {
        reactant:{
          'H2':1,
          'O2':1
        },
        product:{
          'H2O':2,
          'O':1
        }
      }
      
      $scope.react(0.5,reaction);
      
      expect($scope.player.resources['H2'].number).toEqual(50);
      expect($scope.player.resources['O2'].number).toEqual(25);
      expect($scope.player.resources['H2O'].number).toEqual(0);
      expect($scope.player.resources['O'].number).toEqual(1);
      expect($scope.$emit).not.toHaveBeenCalled();
    });    
	
    it("should return if the number specified is negative", function() {
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H2'] = {number:50};
      $scope.player.resources['O2'] = {number:25};
			$scope.player.resources['H2O'] = {number:0};
			$scope.player.resources['O'] = {number:1};
      spyOn($scope,'isReactionCostMet').and.returnValue(true);
    	
      reaction = {
        reactant:{
          'H2':1,
          'O2':1
        },
        product:{
          'H2O':2,
          'O':1
        }
      }
      
      $scope.react(-10,reaction);
      
      expect($scope.player.resources['H2'].number).toEqual(50);
      expect($scope.player.resources['O2'].number).toEqual(25);
      expect($scope.player.resources['H2O'].number).toEqual(0);
      expect($scope.player.resources['O'].number).toEqual(1);
      expect($scope.$emit).not.toHaveBeenCalled();
    });   
	
    it("should return if the cost is not met", function() {
      $scope.player = {};
      $scope.player.resources = {};
      $scope.player.resources['H2'] = {number:50};
      $scope.player.resources['O2'] = {number:25};
			$scope.player.resources['H2O'] = {number:0};
			$scope.player.resources['O'] = {number:1};
      spyOn($scope,'isReactionCostMet').and.returnValue(false);
    	
      reaction = {
        reactant:{
          'H2':1,
          'O2':1
        },
        product:{
          'H2O':2,
          'O':1
        }
      }
      
      $scope.react(5,reaction);
      
      expect($scope.player.resources['H2'].number).toEqual(50);
      expect($scope.player.resources['O2'].number).toEqual(25);
      expect($scope.player.resources['H2O'].number).toEqual(0);
      expect($scope.player.resources['O'].number).toEqual(1);
      expect($scope.$emit).not.toHaveBeenCalled();
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    var $scope, controller;

    beforeEach(function() {
      $scope = $rootScope.$new(),
      controller = $controller('IncCtrl', {$scope:$scope});
    });
    
    it("should ", function() {      
      //value = $scope.xxxxxx();
      
      //expect(value).toEqual('xxxxxx');
    });
  });
});
