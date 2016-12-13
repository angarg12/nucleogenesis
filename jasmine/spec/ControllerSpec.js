describe("Incremental table elements", function() {
  beforeEach(angular.mock.module('incremental'));

  var $timeout;
  var $scope;
  var controller;
  var achievement;
  
  beforeEach(inject(function(_$rootScope_, _$controller_,_$timeout_, $injector){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    spyOn($rootScope, '$emit').and.callThrough();
    $scope = $rootScope.$new();
    achievement = $injector.get('achievement');
    util = $injector.get('util');
    player = $injector.get('player');
    controller  = $controller('IncCtrl', {$scope:$scope, achievement:achievement, util:util, player:player});
    loadData($scope);
  }));

  describe('intro animation', function() { 
    it("should call all steps while playing the intro", function() {
      player.player = {intro:{}};
      player.player.intro['banner'] = false;
      player.player.intro['menu'] = false;
      player.player.intro['content'] = false;
      
      $scope.introAnimation();
      
      // we need this to simplify the test
      $timeout.cancel(controller.onload);
      $timeout.flush();
      
      expect(player.player.intro['banner']).toEqual(true);
      expect(player.player.intro['menu']).toEqual(true);
      expect(player.player.intro['content']).toEqual(true);
    });
        
    it("should take a step", function() {
      player.player = {intro:{}};
      player.player.intro['banner'] = false;
      
      controller.introStep('banner');
      
      expect(player.player.intro['banner']).toEqual(true);
    });
    
    it("should not flip other states", function() {
      player.player = {intro:{}};
      player.player.intro['menu'] = false;
      player.player.intro['content'] = true;
      
      controller.introStep('banner');
      
      expect(player.player.intro['menu']).toEqual(false);
      expect(player.player.intro['content']).toEqual(true);
    });
  });
  
  describe('initialization functions', function() {    
    it("should init all the variables", function() {
      spyOn(player, "populatePlayer");
      
      $scope.init();
      
			expect($scope.current_tab).toEqual("Elements");
			expect($scope.current_entry).toEqual("Hydrogen");
			expect($scope.current_element).toEqual("H");
			expect($scope.hover_element).toEqual("");
			expect(achievement.toast).toEqual([]);
			expect(achievement.is_toast_visible).toEqual(false);
			expect(player.populatePlayer).toHaveBeenCalled();
    });
  });
  
  describe('misc functions', function() {
    it("should catch resource event", function() {
      player.player = {resources:{}};
      player.player.resources.H = {unlocked:false}
      $scope.$emit("resource","H");    
      
      controller.checkUnlock();
      
      expect(player.player.resources.H.unlocked).toEqual(true);
    });
  });
  
  describe('onload', function() {
    beforeEach(function() {
      spyOn(window, "loadData");
			spyOn(player, "load");
			spyOn($scope, "init");
			spyOn($scope, "introAnimation");
			spyOn(achievement, "initializeListeners");
    });
    
    it("should load the game", function() {
      spyOn(localStorage, "getItem").and.returnValue(null);
      
      // flush onload
      $timeout.flush();
      
			expect(player.load).not.toHaveBeenCalled();
			expect(loadData).toHaveBeenCalled();
			expect(localStorage.getItem).toHaveBeenCalled();
			expect($scope.init).toHaveBeenCalled();
			expect($scope.introAnimation).toHaveBeenCalled();
			expect(achievement.initializeListeners).toHaveBeenCalled();
			expect($scope.lastSave).toEqual("None");
    });
    
    it("should load the player", function() {
      spyOn(localStorage, "getItem").and.returnValue("");
    
      // flush onload
      $timeout.flush();
      
			expect(player.load).toHaveBeenCalled();
    });
    
    it("should not init if the player exists", function() {
      player.player = "";
    
      // flush onload
      $timeout.flush();
      
			expect($scope.init).not.toHaveBeenCalled();
    });
    
    it("should not overwrite lastSave", function() {
      $scope.lastSave = "test";
    
      // flush onload
      $timeout.flush();
      
			expect($scope.lastSave).toEqual("test");
    });
  });
  
  describe('formatting functions', function() {    
    it("should format reactions", function() {
      value = $scope.reactionFormat(1, $scope.synthesis['H-p']);
      
      expect(value).toEqual('H<sup>-</sup> + p <span class=\"icon\">&#8594;</span> H<sub>2</sub> + 17.3705 eV');
    });
      
    it("should format multiple reactions", function() {
      value = $scope.reactionFormat(10, $scope.synthesis['H-p']);
      
      expect(value).toEqual('10 H<sup>-</sup> + 10 p <span class=\"icon\">&#8594;</span> 10 H<sub>2</sub> + 173.705 eV');
    });
    
    it("should format single compounds", function() {
      value = $scope.compoundFormat(1, $scope.synthesis['H-p'].product);
      
      expect(value).toEqual('H<sub>2</sub> + 17.3705 eV');
    });
    
    it("should format mutiple compounds", function() {
      value = $scope.compoundFormat(10, $scope.synthesis['H-p'].product);
      
      expect(value).toEqual('10 H<sub>2</sub> + 173.705 eV');
    });
  
    it("should format decay", function() {
      value = $scope.decayFormat($scope.resources['3H'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span><sup>3</sup>He<sup>+</sup> + e- + 18,610 eV');
    }); 
    
    it("should format decay without energy", function() {
      $scope.resources['3H'].decay.decay_product.eV = undefined;
    
      value = $scope.decayFormat($scope.resources['O3'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span>O<sub>2</sub> + O');
    });
  });
    
  describe('prices and cost', function() {
    it("should calculate element price", function() {  
      player.player = {};
      player.player.elements_unlocked = 1;
    
      value = $scope.elementPrice('O');
      
      expect(value).toEqual(256);
    });   
    
    it("should calculate element price 2", function() {
      player.player = {};
      player.player.elements_unlocked = 5;
    
      value = $scope.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(8.0828128e+38.toPrecision(6),6);
    });
    
    it("should check if the cost of an element is met", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['e-'] = {number:0};
			player.player.resources.p = {number:300};
			player.player.resources.n = {number:300};
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    });    
    
    it("should check if the cost of an element is met 2", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['e-'] = {number:300};
			player.player.resources.p = {number:0};
			player.player.resources.n = {number:300};
      player.player.elements_unlocked = 1;
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    }); 
    
    it("should check if the cost of an element is met 3", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['e-'] = {number:300};
			player.player.resources.p = {number:300};
			player.player.resources.n = {number:0};
      player.player.elements_unlocked = 1;
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    });
        
    it("should check if the cost of an element is met 4", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['e-'] = {number:300};
			player.player.resources.p = {number:300};
			player.player.resources.n = {number:300};
      player.player.elements_unlocked = 1;
    
      value = $scope.isElementCostMet('O');
      
      expect(value).toEqual(true);
    });
    
    it("should check if the cost of a synthesis is met", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['H-'] = {number:0};
			player.player.resources.p = {number:10};
			player.player.synthesis = {};
      player.player.synthesis['H-p'] = {};
      player.player.synthesis['H-p'].number = 0;
      
      value = $scope.isSynthesisCostMet('H-p');
      
      expect(value).toEqual(false);
    });  
    
    it("should check if the cost of a synthesis is met 2", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['H-'] = {number:2};
			player.player.resources.p = {number:0};
      player.player.synthesis = {};
      player.player.synthesis['H-p'] = {};
      player.player.synthesis['H-p'].number = 0;
      
      value = $scope.isSynthesisCostMet('H-p');
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a synthesis is met 3", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources['H-'] = {number:2};
			player.player.resources.p = {number:10};
      player.player.synthesis = {};
      player.player.synthesis['H-p'] = {};
      player.player.synthesis['H-p'].number = 0;
      
      value = $scope.isSynthesisCostMet('H-p');
      
      expect(value).toEqual(true);
    });
    
    it("should check if the cost of a reaction is met", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:0};
			player.player.resources.eV = {number:15};

      value = $scope.isReactionCostMet(1, $scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });   
    
    it("should check if the cost of a reaction is met 2", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:5};
			player.player.resources.eV = {number:5};
      
      value = $scope.isReactionCostMet(1, $scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a reaction is met 3", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
			player.player.resources.eV = {number:50};

      value = $scope.isReactionCostMet(10, $scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a reaction is met 4", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:5};
			player.player.resources.eV = {number:50};
      
      value = $scope.isReactionCostMet(1, $scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(true);
    });  
    
    it("should check if the cost of a reaction is met 5", function() {  
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
			player.player.resources.eV = {number:500};

      value = $scope.isReactionCostMet(10, $scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(true);
    });
    
    it("should return the price of a generator", function() {  
      player.player = {};
      player.player.elements = {'H':{}};
      player.player.elements.H = {'generators':{}};
      player.player.elements.H.generators['Tier 1'] = {'level':5};

      value = $scope.generatorPrice('Tier 1','H');
      
      expect(value).toEqual(20);
    });
    
    it("should return the price of a generator 2", function() {  
      player.player = {};
      player.player.elements = {'H':{}};
      player.player.elements.H = {'generators':{}};
      player.player.elements.H.generators['Tier 3'] = {'level':10};
    
      value = $scope.generatorPrice('Tier 3','H');
      
      expect(value).toEqual(1792);
    });

    it("should return the price of a synthesis", function() {
      player.player = {synthesis:{}};      
      player.player.synthesis.H2O = {};    
      player.player.synthesis.H2O.number = 2;
    
      value = $scope.synthesisPrice('H2O');
      
      expect(value).toEqual({'H2':4,'O2':2});
    });
    
    it("should return the las tier upgrade price", function() {  
      player.player = {elements:{}};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades['Tier 1-1'] = {bought:true};      
      player.player.elements.H.upgrades['Tier 1-2'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-3'] = {bought:false};
      $scope.current_element = 'H';
    
      value = $scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toEqual(10000);
    });    
    
    it("should return null if all upgrades are bought", function() {  
      player.player = {elements:{}};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades['Tier 1-1'] = {bought:true};      
      player.player.elements.H.upgrades['Tier 1-2'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-3'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-4'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-5'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-6'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-7'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-8'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-9'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-10'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-11'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-12'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-13'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-14'] = {bought:true};
      $scope.current_element = 'H';
    
      value = $scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toBeNull();
    });
  });
  
  describe('purchase functions', function() {
    it("should purchase element if cost is met", function() {
      player.player = {elements:{},resources:{},elements_unlocked:1};
      player.player.resources['e-'] = {number:256};
      player.player.resources.p = {number:257};
      player.player.resources.n = {number:258};
      player.player.elements.O = {unlocked:false,generators:{}};
      player.player.elements.O.generators["Tier 1"] = {level:0};
      
      $scope.buyElement('O');
      
      expect(player.player.resources['e-'].number).toEqual(0);
      expect(player.player.resources.p.number).toEqual(1);
      expect(player.player.resources.n.number).toEqual(2);
      expect(player.player.elements.O.unlocked).toEqual(true);
      expect(player.player.elements.O.generators["Tier 1"].level).toEqual(1);
      expect(player.player.elements_unlocked).toEqual(2);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase element if cost is not met", function() {
      player.player = {elements:{},resources:{},elements_unlocked:2};
      player.player.resources['e-'] = {number:256};
      player.player.resources.p = {number:257};
      player.player.resources.n = {number:258};
      player.player.elements.O = {unlocked:false,generators:{}};
      player.player.elements.O.generators["Tier 1"] = {level:0};
      
      $scope.buyElement('O');
      
      expect(player.player.resources['e-'].number).toEqual(256);
      expect(player.player.resources.p.number).toEqual(257);
      expect(player.player.resources.n.number).toEqual(258);
      expect(player.player.elements.O.unlocked).toEqual(false);
      expect(player.player.elements.O.generators["Tier 1"].level).toEqual(0);
      expect(player.player.elements_unlocked).toEqual(2);
      expect($scope.$emit).not.toHaveBeenCalled();
    }); 
    
    it("should skip if the element is already purchased", function() {
      spyOn($scope,'isElementCostMet');
      player.player = {elements:{}};
      player.player.elements.O = {unlocked:true};   

      $scope.buyElement('O');
      
      expect($scope.isElementCostMet).not.toHaveBeenCalled();
    });
    
    it("should purchase an upgrade if cost is met", function() {      
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:110};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect(player.player.resources.H.number).toEqual(10);
      expect(player.player.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });
    
    it("should not purchase an upgrade if cost is not met", function() {      
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:10};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect(player.player.resources.H.number).toEqual(10);
      expect(player.player.elements.H.upgrades["Tier 1-1"].bought).toEqual(false);
    });
    
    it("should skip if the upgrade is already bought", function() {
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:10};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades["Tier 1-1"] = {bought:true};
      
      $scope.buyUpgrade("Tier 1-1",'H');
      
      expect(player.player.resources.H.number).toEqual(10);
      expect(player.player.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });  

    it("should purchase as many generators as requested", function() {
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:65};
      player.player.elements.H = {generators:{}};
      player.player.elements.H.generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',3);
      
      expect(player.player.resources.H.number).toEqual(2);
      expect(player.player.elements.H.generators["Tier 1"].level).toEqual(8);
      expect($scope.$emit).toHaveBeenCalled();
    });    
    
    it("should purchase as many generators as possible until money runs out requested", function() {
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:45};
      player.player.elements.H = {generators:{}};
      player.player.elements.H.generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',3);
      
      expect(player.player.resources.H.number).toEqual(4);
      expect(player.player.elements.H.generators["Tier 1"].level).toEqual(7);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase negative generators", function() {
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:10};
      player.player.elements.H = {generators:{}};
      player.player.elements.H.generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',-10);
      
      expect(player.player.resources.H.number).toEqual(10);
      expect(player.player.elements.H.generators["Tier 1"].level).toEqual(5);
      expect($scope.$emit).not.toHaveBeenCalled();
    });
    
    it("should not purchase generator if cost is not met", function() {
      player.player = {elements:{},resources:{}};
      player.player.resources.H = {number:10};
      player.player.elements.H = {generators:{}};
      player.player.elements.H.generators["Tier 1"] = {level:5};
      
      $scope.buyGenerators("Tier 1",'H',10);
      
      expect(player.player.resources.H.number).toEqual(10);
      expect(player.player.elements.H.generators["Tier 1"].level).toEqual(5);
      expect($scope.$emit).not.toHaveBeenCalled();
    });    
    
    it("should purchase as many synthesis as requested", function() {
      player.player = {synthesis:{},resources:{}};
      player.player.resources['H2'] = {number:32};
      player.player.resources['O2'] = {number:32};
      player.player.synthesis['H2O'] = {number:1};
      
      $scope.buySynthesis('H2O',3);
      
      expect(player.player.resources['H2'].number).toEqual(20);
      expect(player.player.resources['O2'].number).toEqual(26);
      expect(player.player.synthesis['H2O'].number).toEqual(4);
    });
    
    it("should purchase as many synthesis as possible", function() {
      player.player = {synthesis:{},resources:{}};
      player.player.resources['H2'] = {number:10};
      player.player.resources['O2'] = {number:32};
      player.player.synthesis['H2O'] = {number:1};
      
      $scope.buySynthesis('H2O',3);
      
      expect(player.player.resources['H2'].number).toEqual(2);
      expect(player.player.resources['O2'].number).toEqual(28);
      expect(player.player.synthesis['H2O'].number).toEqual(3);
    });  
    
    it("should not purchase negative synthesis", function() {
      player.player = {synthesis:{},resources:{}};
      player.player.resources['H2'] = {number:32};
      player.player.resources['O2'] = {number:32};
      player.player.synthesis['H2O'] = {number:1};
      
      $scope.buySynthesis('H2O',-3);
      
      expect(player.player.resources['H2'].number).toEqual(32);
      expect(player.player.resources['O2'].number).toEqual(32);
      expect(player.player.synthesis['H2O'].number).toEqual(1);
    });   
    
    it("should not purchase synthesis if the cost is not met", function() {
      player.player = {synthesis:{},resources:{}};
      player.player.resources['H2'] = {number:2};
      player.player.resources['O2'] = {number:32};
      player.player.synthesis['H2O'] = {number:1};
      
      $scope.buySynthesis('H2O',3);
      
      expect(player.player.resources['H2'].number).toEqual(2);
      expect(player.player.resources['O2'].number).toEqual(32);
      expect(player.player.synthesis['H2O'].number).toEqual(1);
    });
  });
  
  describe('production functions', function() {
    it("should calculate the generator production", function() {
      $scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      player.player = {elements:{}};
      player.player.elements.H = {upgrades:{}};
      player.player.elements.H.upgrades['Tier 1-1'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-2'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-3'] = {bought:false};
    
      value = $scope.generatorProduction('Tier 1','H');
      
      expect(value).toEqual(6);
    });
    
    it("should calculate the tier production", function() {
      $scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      player.player = {elements:{}};
      player.player.elements.H = {upgrades:{},generators:{}};
      player.player.elements.H.upgrades['Tier 1-1'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-2'] = {bought:true};
      player.player.elements.H.upgrades['Tier 1-3'] = {bought:false};
      player.player.elements.H.generators['Tier 1'] = {level:10};

    
      value = $scope.tierProduction('Tier 1','H');
      
      expect(value).toEqual(60);
    });    
    
    it("should calculate the element production", function() {
      $scope.generators['Tier 1'].upgrades = [];
      $scope.generators['Tier 2'].upgrades = [];
      $scope.generators['Tier 3'].upgrades = [];
      temp1 = $scope.generators['Tier 1'];
      temp2 = $scope.generators['Tier 2'];
      temp3 = $scope.generators['Tier 3'];
      $scope.generators = {};
      $scope.generators['Tier 1'] = temp1;
      $scope.generators['Tier 2'] = temp2;
      $scope.generators['Tier 3'] = temp3;
      
      player.player = {elements:{}};
      player.player.elements.H = {generators:{}};
      player.player.elements.H.generators['Tier 1'] = {level:1};
      player.player.elements.H.generators['Tier 2'] = {level:1};
      player.player.elements.H.generators['Tier 3'] = {level:1};
      
      value = $scope.elementProduction('H');
      
      expect(value).toEqual(91);
    });
  });
    
  describe('react', function() {
    it("should react the number specified", function() {
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
      player.player.resources.eV = {number:200};
      player.player.resources.p = {number:1};
			player.player.resources['e-'] = {number:0};

      $scope.react(10,$scope.reactions.H.ionization['1']);
      
      expect(player.player.resources.H.number).toEqual(40);
      expect(player.player.resources.eV.number).toEqual(64.016);
      expect(player.player.resources.p.number).toEqual(11);
      expect(player.player.resources['e-'].number).toEqual(10);
      expect($scope.$emit).toHaveBeenCalled();
    });
    
    it("should return if the number specified is invalid", function() {
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
      player.player.resources.eV = {number:200};
      player.player.resources.p = {number:1};
      player.player.resources['e-'] = {number:0};
      
      $scope.react(0.5,$scope.reactions.H.ionization['1']);
      
      expect(player.player.resources.H.number).toEqual(50);
      expect(player.player.resources.eV.number).toEqual(200);
      expect(player.player.resources.p.number).toEqual(1);
      expect(player.player.resources['e-'].number).toEqual(0);
      expect($scope.$emit).not.toHaveBeenCalled();
    });    
	
    it("should return if the number specified is negative", function() {
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
      player.player.resources.eV = {number:200};
      player.player.resources.p = {number:1};
      player.player.resources['e-'] = {number:0};

      $scope.react(-10,$scope.reactions.H.ionization['1']);
      
      expect(player.player.resources.H.number).toEqual(50);
      expect(player.player.resources.eV.number).toEqual(200);
      expect(player.player.resources.p.number).toEqual(1);
      expect(player.player.resources['e-'].number).toEqual(0);
      expect($scope.$emit).not.toHaveBeenCalled();
    });   
	
    it("should return if the cost is not met", function() {
      player.player = {};
      player.player.resources = {};
      player.player.resources.H = {number:50};
      player.player.resources.eV = {number:10};
      player.player.resources.p = {number:1};
      player.player.resources['e-'] = {number:0};
      
      $scope.react(5,$scope.reactions.H.ionization['1']);

      expect(player.player.resources.H.number).toEqual(50);
      expect(player.player.resources.eV.number).toEqual(10);
      expect(player.player.resources.p.number).toEqual(1);
      expect(player.player.resources['e-'].number).toEqual(0);
      expect($scope.$emit).not.toHaveBeenCalled();
    });
  });

  describe('poisson', function() {
    it("should generate numbers according to a poisson", function() {      
      spyOn(Math,'random').and.returnValue(0.1);
      
      value = controller.getPoisson(1);

      expect(value).toEqual(0);
    });

    it("should generate numbers according to a poisson 2", function() {      
      spyOn(Math,'random').and.returnValues(1,0.1);
      
      value = controller.getPoisson(1);

      expect(value).toEqual(1);
    });

    it("should generate numbers according to a poisson 3", function() {      
      spyOn(Math,'random').and.returnValues(0.8,0.4,0.2,0.1);
      
      value = controller.getPoisson(4);

      expect(value).toEqual(3);
    });
  });
  
  describe('random draw', function() {
    it("should return a normally distributed random number", function() {
      spyOn(Math,'random').and.returnValues(0.4,0.2);
      
      value = controller.randomDraw(100, Math.log(2)/50);
      
      expect(value).toEqual(1);
    });
    
    it("should return a normally distributed random number 2", function() {
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValues(0.5);
      
      value = controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(16);
    });
    
    it("should not return negative value", function() {
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValues(-1000);
      
      value = controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(0);
    });
    
    it("should not return overproduction", function() {
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValues(1000);
      
      value = controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(1000);
    });
  });
  
  describe('update', function() {
    it("should not update player if nothing is purchased", function() {
      player.populatePlayer();
      player.player = angular.copy(player.startPlayer);
      
      controller.update();
      
      expect(player.player).toEqual(player.startPlayer);
    });

    it("should generate isotopes", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.elements.O.unlocked = true;
      player.player.elements.O.generators['Tier 1'].level = 200;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources.O.number).toEqual(200);
      expect(player.player.resources['17O'].number).toEqual(0);
      expect(player.player.resources['18O'].number).toEqual(0);
    });
    
    it("should generate isotopes 2", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.elements.O.unlocked = true;
      player.player.elements.O.generators['Tier 1'].level = 1200;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources.O.number).toEqual(1197);
      expect(player.player.resources['17O'].number).toEqual(0);
      expect(player.player.resources['18O'].number).toEqual(3);
    });
    
    it("should generate isotopes 3", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.elements.O.unlocked = true;
      player.player.elements.O.generators['Tier 1'].level = 32000;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources.O.number).toEqual(31923);
      expect(player.player.resources['17O'].number).toEqual(13);
      expect(player.player.resources['18O'].number).toEqual(64);
    });
    
    it("should process synthesis", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.synthesis.H2O.number = 2;
      player.player.synthesis.H2O.active = 2;
      player.player.resources.H2.number = 10;
      player.player.resources.O2.number = 5;
      
      controller.update();
      
      expect(player.player.resources.H2.number).toEqual(2);
      expect(player.player.resources.O2.number).toEqual(1);
      expect(player.player.resources.H2O.number).toEqual(8);
      expect(player.player.resources.eV.number).toEqual(23.7);
    });
    
    it("should process radioactivity", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.resources['3H'].unlocked = true;
      player.player.resources['3H'].number = 1000;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources['3H'].number).toEqual(1000);
      expect(player.player.resources['3He+1'].number).toEqual(0);
      expect(player.player.resources['e-'].number).toEqual(0);
      expect(player.player.resources.eV.number).toEqual(0);
    });
    
    it("should process radioactivity 2", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.resources['3H'].unlocked = true;
      player.player.resources['3H'].number = 1e+10;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources['3H'].number).toEqual(9999999982);
      expect(player.player.resources['3He+1'].number).toEqual(18);
      expect(player.player.resources['e-'].number).toEqual(18);
      expect(player.player.resources.eV.number).toEqual(334980);
    });
    
    it("should process unstables", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.resources.O3.unlocked = true;
      player.player.resources.O3.number = 1000;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      expect(player.player.resources.O3.number).toEqual(1000);
      expect(player.player.resources.O2.number).toEqual(0);
      expect(player.player.resources.O.number).toEqual(0);
    });
    
    it("should process unstables 2", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.resources.O3.unlocked = true;
      player.player.resources.O3.number = 1e6;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      // clear this subscriber to avoid side effects
      controller.checkUnlock();
      
      controller.update();
      
      expect(player.player.resources.O3.number).toEqual(999992);
      expect(player.player.resources.O2.number).toEqual(8);
      expect(player.player.resources.O.number).toEqual(8);
    });

    it("should process radicals", function() {
      player.populatePlayer();
      player.player = player.startPlayer;
      player.player.resources.O.unlocked = true;
      player.player.resources.O.number = 1000;
      player.player.resources.O.unlocked = true;
      player.player.resources.O2.number = 1e8;
      spyOn(controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(controller,'getPoisson').and.returnValue(0);
      
      controller.update();
      
      // the logic is the following
      // we start with 1000 O. Out of those, 5% react (50)
      // the reactants are in total 1000 O and 1e8 O2
      // with reactivity 1e-6, 100 of O2 react with O
      // the sum is 1100, so we split 1000/1100 and 100/1100
      // for O we react around 90.9%, which is 45. However 45 is odd
      // so we adjust down to 44. 44 O generate 22 O2.
      // then we have 5 reactions of O with O2. We subtract them
      // and obtain the final values.
      expect(player.player.resources.O.number).toEqual(951);
      expect(player.player.resources.O2.number).toEqual(100000017);
      expect(player.player.resources.O3.number).toEqual(5);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it("should ", function() {
      //value = $scope.xxxxxx();
      
      //expect(value).toEqual('xxxxxx');
    });
  });
});
