describe("Incremental table elements", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('initialization functions', function() {    
    it("should init all the variables", function() {
      spyOn(spec.player, "populatePlayer");
      
      spec.$scope.init();
      
			expect(spec.$scope.current_tab).toEqual("Elements");
			expect(spec.$scope.current_entry).toEqual("Hydrogen");
			expect(spec.$scope.current_element).toEqual("H");
			expect(spec.$scope.hover_element).toEqual("");
			expect(spec.achievement.toast).toEqual([]);
			expect(spec.achievement.is_toast_visible).toEqual(false);
			expect(spec.player.populatePlayer).toHaveBeenCalled();
    });
  });
  
  describe('misc functions', function() {
    it("should catch resource event", function() {
      spec.player.data = {resources:{}};
      spec.player.data.resources.H = {unlocked:false}
      spec.$scope.$emit("resource","H");    
      
      spec.controller.checkUnlock();
      
      expect(spec.player.data.resources.H.unlocked).toEqual(true);
    });
  });
  
  describe('onload', function() {
    beforeEach(function() {
      spyOn(window, "loadData");
			spyOn(spec.savegame, "load");
			spyOn(spec.$scope, "init");
			spyOn(spec.animation, "introAnimation");
			spyOn(spec.achievement, "initializeListeners");
    });
    
    it("should load the game", function() {
      spyOn(localStorage, "getItem").and.returnValue(null);
      
      // flush onload
      spec.$timeout.flush();
      
			expect(spec.savegame.load).not.toHaveBeenCalled();
			expect(loadData).toHaveBeenCalled();
			expect(localStorage.getItem).toHaveBeenCalled();
			expect(spec.$scope.init).toHaveBeenCalled();
			expect(spec.animation.introAnimation).toHaveBeenCalled();
			expect(spec.achievement.initializeListeners).toHaveBeenCalled();
			expect(spec.$scope.lastSave).toEqual("None");
    });
    
    it("should load the player", function() {
      spyOn(localStorage, "getItem").and.returnValue("");
    
      // flush onload
      spec.$timeout.flush();
      
			expect(spec.savegame.load).toHaveBeenCalled();
    });
    
    it("should not init if the player exists", function() {
      spec.player.data = "";
    
      // flush onload
      spec.$timeout.flush();
      
			expect(spec.$scope.init).not.toHaveBeenCalled();
    });
    
    it("should not overwrite lastSave", function() {
      spec.$scope.lastSave = "test";
    
      // flush onload
      spec.$timeout.flush();
      
			expect(spec.$scope.lastSave).toEqual("test");
    });
  });
  
  describe('prices and cost', function() {
    it("should calculate element price", function() {  
      spec.player.data = {};
      spec.player.data.elements_unlocked = 1;
    
      value = spec.$scope.elementPrice('O');
      
      expect(value).toEqual(256);
    });   
    
    it("should calculate element price 2", function() {
      spec.player.data = {};
      spec.player.data.elements_unlocked = 5;
    
      value = spec.$scope.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(8.0828128e+38.toPrecision(6),6);
    });
    
    it("should check if the cost of an element is met", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:0};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:300};
    
      value = spec.$scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    });    
    
    it("should check if the cost of an element is met 2", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:0};
			spec.player.data.resources.n = {number:300};
      spec.player.data.elements_unlocked = 1;
    
      value = spec.$scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    }); 
    
    it("should check if the cost of an element is met 3", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:0};
      spec.player.data.elements_unlocked = 1;
    
      value = spec.$scope.isElementCostMet('O');
      
      expect(value).toEqual(false);
    });
        
    it("should check if the cost of an element is met 4", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:300};
      spec.player.data.elements_unlocked = 1;
    
      value = spec.$scope.isElementCostMet('O');
      
      expect(value).toEqual(true);
    });
    
    it("should check if the cost of a reaction is met", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:0};
			spec.player.data.resources.eV = {number:15};

      value = spec.$scope.isReactionCostMet(1, spec.$scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });   
    
    it("should check if the cost of a reaction is met 2", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:5};
			spec.player.data.resources.eV = {number:5};
      
      value = spec.$scope.isReactionCostMet(1, spec.$scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a reaction is met 3", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
			spec.player.data.resources.eV = {number:50};

      value = spec.$scope.isReactionCostMet(10, spec.$scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a reaction is met 4", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:5};
			spec.player.data.resources.eV = {number:50};
      
      value = spec.$scope.isReactionCostMet(1, spec.$scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(true);
    });  
    
    it("should check if the cost of a reaction is met 5", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
			spec.player.data.resources.eV = {number:500};

      value = spec.$scope.isReactionCostMet(10, spec.$scope.reactions.H.ionization['1']);
      
      expect(value).toEqual(true);
    });  
  });
  
  describe('purchase functions', function() {
    it("should purchase element if cost is met", function() {
      spec.player.data = {elements:{},resources:{},elements_unlocked:1};
      spec.player.data.resources['e-'] = {number:256};
      spec.player.data.resources.p = {number:257};
      spec.player.data.resources.n = {number:258};
      spec.player.data.elements.O = {unlocked:false,generators:{}};
      spec.player.data.elements.O.generators["Tier 1"] = {level:0};
      
      spec.$scope.buyElement('O');
      
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources.n.number).toEqual(2);
      expect(spec.player.data.elements.O.unlocked).toEqual(true);
      expect(spec.player.data.elements.O.generators["Tier 1"].level).toEqual(1);
      expect(spec.player.data.elements_unlocked).toEqual(2);
      expect(spec.$scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase element if cost is not met", function() {
      spec.player.data = {elements:{},resources:{},elements_unlocked:2};
      spec.player.data.resources['e-'] = {number:256};
      spec.player.data.resources.p = {number:257};
      spec.player.data.resources.n = {number:258};
      spec.player.data.elements.O = {unlocked:false,generators:{}};
      spec.player.data.elements.O.generators["Tier 1"] = {level:0};
      
      spec.$scope.buyElement('O');
      
      expect(spec.player.data.resources['e-'].number).toEqual(256);
      expect(spec.player.data.resources.p.number).toEqual(257);
      expect(spec.player.data.resources.n.number).toEqual(258);
      expect(spec.player.data.elements.O.unlocked).toEqual(false);
      expect(spec.player.data.elements.O.generators["Tier 1"].level).toEqual(0);
      expect(spec.player.data.elements_unlocked).toEqual(2);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    }); 
    
    it("should skip if the element is already purchased", function() {
      spyOn(spec.$scope,'isElementCostMet');
      spec.player.data = {elements:{}};
      spec.player.data.elements.O = {unlocked:true};   

      spec.$scope.buyElement('O');
      
      expect(spec.$scope.isElementCostMet).not.toHaveBeenCalled();
    });    
  });
  
  describe('react', function() {
    it("should react the number specified", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
			spec.player.data.resources['e-'] = {number:0};

      spec.$scope.react(10,spec.$scope.reactions.H.ionization['1']);
      
      expect(spec.player.data.resources.H.number).toEqual(40);
      expect(spec.player.data.resources.eV.number).toEqual(64.016);
      expect(spec.player.data.resources.p.number).toEqual(11);
      expect(spec.player.data.resources['e-'].number).toEqual(10);
      expect(spec.$scope.$emit).toHaveBeenCalled();
    });
    
    it("should return if the number specified is invalid", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};
      
      spec.$scope.react(0.5,spec.$scope.reactions.H.ionization['1']);
      
      expect(spec.player.data.resources.H.number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(200);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    });    
	
    it("should return if the number specified is negative", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
      spec.player.data.resources.eV = {number:200};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};

      spec.$scope.react(-10,spec.$scope.reactions.H.ionization['1']);
      
      expect(spec.player.data.resources.H.number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(200);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    });   
	
    it("should return if the cost is not met", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources.H = {number:50};
      spec.player.data.resources.eV = {number:10};
      spec.player.data.resources.p = {number:1};
      spec.player.data.resources['e-'] = {number:0};
      
      spec.$scope.react(5,spec.$scope.reactions.H.ionization['1']);

      expect(spec.player.data.resources.H.number).toEqual(50);
      expect(spec.player.data.resources.eV.number).toEqual(10);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    });
  });

  describe('poisson', function() {
    it("should generate numbers according to a poisson", function() {      
      spyOn(Math,'random').and.returnValue(0.1);

      value = spec.controller.getPoisson(1);

      expect(value).toEqual(0);
    });

    it("should generate numbers according to a poisson 2", function() {      
      spyOn(Math,'random').and.returnValues(1,0.1);
      
      value = spec.controller.getPoisson(1);

      expect(value).toEqual(1);
    });

    it("should generate numbers according to a poisson 3", function() {      
      spyOn(Math,'random').and.returnValues(0.8,0.4,0.2,0.1);
      
      value = spec.controller.getPoisson(4);

      expect(value).toEqual(3);
    });
  });
  
  describe('random draw', function() {
    it("should return a normally distributed random number", function() {
      spyOn(Math,'random').and.returnValues(0.4,0.2);
      
      value = spec.controller.randomDraw(100, Math.log(2)/50);
      
      expect(value).toEqual(1);
    });
    
    it("should return a normally distributed random number 2", function() {
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValues(0.5);
      
      value = spec.controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(16);
    });
    
    it("should not return negative value", function() {
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValues(-1000);
      
      value = spec.controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(0);
    });
    
    it("should not return overproduction", function() {
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValues(1000);
      
      value = spec.controller.randomDraw(1000, Math.log(2)/50);
      
      expect(value).toEqual(1000);
    });
  });
  
  describe('update', function() {
    it("should not update player if nothing is purchased", function() {
      spec.player.populatePlayer();
      spec.player.data = angular.copy(spec.player.startPlayer);
      
      spec.controller.update();
      
      expect(spec.player.data).toEqual(spec.player.startPlayer);
    });

    it("should generate isotopes", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'].level = 200;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources.O.number).toEqual(200);
      expect(spec.player.data.resources['17O'].number).toEqual(0);
      expect(spec.player.data.resources['18O'].number).toEqual(0);
    });
    
    it("should generate isotopes 2", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'].level = 1200;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources.O.number).toEqual(1197);
      expect(spec.player.data.resources['17O'].number).toEqual(0);
      expect(spec.player.data.resources['18O'].number).toEqual(3);
    });
    
    it("should generate isotopes 3", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.elements.O.unlocked = true;
      spec.player.data.elements.O.generators['Tier 1'].level = 32000;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources.O.number).toEqual(31923);
      expect(spec.player.data.resources['17O'].number).toEqual(13);
      expect(spec.player.data.resources['18O'].number).toEqual(64);
    });  
    
    it("should process radioactivity", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.resources['3H'].unlocked = true;
      spec.player.data.resources['3H'].number = 1000;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources['3H'].number).toEqual(1000);
      expect(spec.player.data.resources['3He+1'].number).toEqual(0);
      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.player.data.resources.eV.number).toEqual(0);
    });
    
    it("should process radioactivity 2", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.resources['3H'].unlocked = true;
      spec.player.data.resources['3H'].number = 1e+10;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources['3H'].number).toEqual(9999999982);
      expect(spec.player.data.resources['3He+1'].number).toEqual(18);
      expect(spec.player.data.resources['e-'].number).toEqual(18);
      expect(spec.player.data.resources.eV.number).toEqual(334980);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it("should ", function() {
      //value = spec.$scope.xxxxxx();
      
      //expect(value).toEqual('xxxxxx');
    });
  });
});
