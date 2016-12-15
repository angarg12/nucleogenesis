describe("Incremental table elements", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('intro animation', function() { 
    it("should call all steps while playing the intro", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['banner'] = false;
      spec.player.data.intro['menu'] = false;
      spec.player.data.intro['content'] = false;
      
      spec.$scope.introAnimation();
      
      // we need spec to simplify the test
      spec.$timeout.cancel(spec.controller.onload);
      spec.$timeout.flush();
      
      expect(spec.player.data.intro['banner']).toEqual(true);
      expect(spec.player.data.intro['menu']).toEqual(true);
      expect(spec.player.data.intro['content']).toEqual(true);
    });
        
    it("should take a step", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['banner'] = false;
      
      spec.controller.introStep('banner');
      
      expect(spec.player.data.intro['banner']).toEqual(true);
    });
    
    it("should not flip other states", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['menu'] = false;
      spec.player.data.intro['content'] = true;
      
      spec.controller.introStep('banner');
      
      expect(spec.player.data.intro['menu']).toEqual(false);
      expect(spec.player.data.intro['content']).toEqual(true);
    });
  });
  
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
			spyOn(spec.$scope, "introAnimation");
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
			expect(spec.$scope.introAnimation).toHaveBeenCalled();
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
  
  describe('formatting functions', function() {    
    it("should format reactions", function() {
      value = spec.$scope.reactionFormat(1, spec.$scope.synthesis['H-p']);
      
      expect(value).toEqual('H<sup>-</sup> + p <span class=\"icon\">&#8594;</span> H<sub>2</sub> + 17.3705 eV');
    });
      
    it("should format multiple reactions", function() {
      value = spec.$scope.reactionFormat(10, spec.$scope.synthesis['H-p']);
      
      expect(value).toEqual('10 H<sup>-</sup> + 10 p <span class=\"icon\">&#8594;</span> 10 H<sub>2</sub> + 173.705 eV');
    });
    
    it("should format single compounds", function() {
      value = spec.$scope.compoundFormat(1, spec.$scope.synthesis['H-p'].product);
      
      expect(value).toEqual('H<sub>2</sub> + 17.3705 eV');
    });
    
    it("should format mutiple compounds", function() {
      value = spec.$scope.compoundFormat(10, spec.$scope.synthesis['H-p'].product);
      
      expect(value).toEqual('10 H<sub>2</sub> + 173.705 eV');
    });
  
    it("should format decay", function() {
      value = spec.$scope.decayFormat(spec.$scope.resources['3H'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span><sup>3</sup>He<sup>+</sup> + e- + 18,610 eV');
    }); 
    
    it("should format decay without energy", function() {
      spec.$scope.resources['3H'].decay.decay_product.eV = undefined;
    
      value = spec.$scope.decayFormat(spec.$scope.resources['O3'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span>O<sub>2</sub> + O');
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
    
    it("should check if the cost of a synthesis is met", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['H-'] = {number:0};
			spec.player.data.resources.p = {number:10};
			spec.player.data.synthesis = {};
      spec.player.data.synthesis['H-p'] = {};
      spec.player.data.synthesis['H-p'].number = 0;
      
      value = spec.$scope.isSynthesisCostMet('H-p');
      
      expect(value).toEqual(false);
    });  
    
    it("should check if the cost of a synthesis is met 2", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['H-'] = {number:2};
			spec.player.data.resources.p = {number:0};
      spec.player.data.synthesis = {};
      spec.player.data.synthesis['H-p'] = {};
      spec.player.data.synthesis['H-p'].number = 0;
      
      value = spec.$scope.isSynthesisCostMet('H-p');
      
      expect(value).toEqual(false);
    });
    
    it("should check if the cost of a synthesis is met 3", function() {  
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['H-'] = {number:2};
			spec.player.data.resources.p = {number:10};
      spec.player.data.synthesis = {};
      spec.player.data.synthesis['H-p'] = {};
      spec.player.data.synthesis['H-p'].number = 0;
      
      value = spec.$scope.isSynthesisCostMet('H-p');
      
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
    
    it("should return the price of a generator", function() {  
      spec.player.data = {};
      spec.player.data.elements = {'H':{}};
      spec.player.data.elements.H = {'generators':{}};
      spec.player.data.elements.H.generators['Tier 1'] = {'level':5};

      value = spec.$scope.generatorPrice('Tier 1','H');
      
      expect(value).toEqual(20);
    });
    
    it("should return the price of a generator 2", function() {  
      spec.player.data = {};
      spec.player.data.elements = {'H':{}};
      spec.player.data.elements.H = {'generators':{}};
      spec.player.data.elements.H.generators['Tier 3'] = {'level':10};
    
      value = spec.$scope.generatorPrice('Tier 3','H');
      
      expect(value).toEqual(1792);
    });

    it("should return the price of a synthesis", function() {
      spec.player.data = {synthesis:{}};      
      spec.player.data.synthesis.H2O = {};    
      spec.player.data.synthesis.H2O.number = 2;
    
      value = spec.$scope.synthesisPrice('H2O');
      
      expect(value).toEqual({'H2':4,'O2':2});
    });
    
    it("should return the las tier upgrade price", function() {  
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};      
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};
      spec.$scope.current_element = 'H';
    
      value = spec.$scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toEqual(10000);
    });    
    
    it("should return null if all upgrades are bought", function() {  
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};      
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-4'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-5'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-6'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-7'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-8'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-9'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-10'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-11'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-12'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-13'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-14'] = {bought:true};
      spec.$scope.current_element = 'H';
    
      value = spec.$scope.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toBeNull();
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
    
    it("should purchase an upgrade if cost is met", function() {      
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:110};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      spec.$scope.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });
    
    it("should not purchase an upgrade if cost is not met", function() {      
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      spec.$scope.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(false);
    });
    
    it("should skip if the upgrade is already bought", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:true};
      
      spec.$scope.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });  

    it("should purchase as many generators as requested", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:65};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};
      
      spec.$scope.buyGenerators("Tier 1",'H',3);
      
      expect(spec.player.data.resources.H.number).toEqual(2);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(8);
      expect(spec.$scope.$emit).toHaveBeenCalled();
    });    
    
    it("should purchase as many generators as possible until money runs out requested", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:45};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};
      
      spec.$scope.buyGenerators("Tier 1",'H',3);
      
      expect(spec.player.data.resources.H.number).toEqual(4);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(7);
      expect(spec.$scope.$emit).toHaveBeenCalled();
    });
    
    it("should not purchase negative generators", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};
      
      spec.$scope.buyGenerators("Tier 1",'H',-10);
      
      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(5);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    });
    
    it("should not purchase generator if cost is not met", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};
      
      spec.$scope.buyGenerators("Tier 1",'H',10);
      
      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(5);
      expect(spec.$scope.$emit).not.toHaveBeenCalled();
    });    
    
    it("should purchase as many synthesis as requested", function() {
      spec.player.data = {synthesis:{},resources:{}};
      spec.player.data.resources['H2'] = {number:32};
      spec.player.data.resources['O2'] = {number:32};
      spec.player.data.synthesis['H2O'] = {number:1};
      
      spec.$scope.buySynthesis('H2O',3);
      
      expect(spec.player.data.resources['H2'].number).toEqual(20);
      expect(spec.player.data.resources['O2'].number).toEqual(26);
      expect(spec.player.data.synthesis['H2O'].number).toEqual(4);
    });
    
    it("should purchase as many synthesis as possible", function() {
      spec.player.data = {synthesis:{},resources:{}};
      spec.player.data.resources['H2'] = {number:10};
      spec.player.data.resources['O2'] = {number:32};
      spec.player.data.synthesis['H2O'] = {number:1};
      
      spec.$scope.buySynthesis('H2O',3);
      
      expect(spec.player.data.resources['H2'].number).toEqual(2);
      expect(spec.player.data.resources['O2'].number).toEqual(28);
      expect(spec.player.data.synthesis['H2O'].number).toEqual(3);
    });  
    
    it("should not purchase negative synthesis", function() {
      spec.player.data = {synthesis:{},resources:{}};
      spec.player.data.resources['H2'] = {number:32};
      spec.player.data.resources['O2'] = {number:32};
      spec.player.data.synthesis['H2O'] = {number:1};
      
      spec.$scope.buySynthesis('H2O',-3);
      
      expect(spec.player.data.resources['H2'].number).toEqual(32);
      expect(spec.player.data.resources['O2'].number).toEqual(32);
      expect(spec.player.data.synthesis['H2O'].number).toEqual(1);
    });   
    
    it("should not purchase synthesis if the cost is not met", function() {
      spec.player.data = {synthesis:{},resources:{}};
      spec.player.data.resources['H2'] = {number:2};
      spec.player.data.resources['O2'] = {number:32};
      spec.player.data.synthesis['H2O'] = {number:1};
      
      spec.$scope.buySynthesis('H2O',3);
      
      expect(spec.player.data.resources['H2'].number).toEqual(2);
      expect(spec.player.data.resources['O2'].number).toEqual(32);
      expect(spec.player.data.synthesis['H2O'].number).toEqual(1);
    });
  });
  
  describe('production functions', function() {
    it("should calculate the generator production", function() {
      spec.$scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};
    
      value = spec.$scope.generatorProduction('Tier 1','H');
      
      expect(value).toEqual(6);
    });
    
    it("should calculate the tier production", function() {
      spec.$scope.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{},generators:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};
      spec.player.data.elements.H.generators['Tier 1'] = {level:10};

    
      value = spec.$scope.tierProduction('Tier 1','H');
      
      expect(value).toEqual(60);
    });    
    
    it("should calculate the element production", function() {
      spec.$scope.generators['Tier 1'].upgrades = [];
      spec.$scope.generators['Tier 2'].upgrades = [];
      spec.$scope.generators['Tier 3'].upgrades = [];
      temp1 = spec.$scope.generators['Tier 1'];
      temp2 = spec.$scope.generators['Tier 2'];
      temp3 = spec.$scope.generators['Tier 3'];
      spec.$scope.generators = {};
      spec.$scope.generators['Tier 1'] = temp1;
      spec.$scope.generators['Tier 2'] = temp2;
      spec.$scope.generators['Tier 3'] = temp3;
      
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators['Tier 1'] = {level:1};
      spec.player.data.elements.H.generators['Tier 2'] = {level:1};
      spec.player.data.elements.H.generators['Tier 3'] = {level:1};
      
      value = spec.$scope.elementProduction('H');
      
      expect(value).toEqual(91);
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
    
    it("should process synthesis", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.synthesis.H2O.number = 2;
      spec.player.data.synthesis.H2O.active = 2;
      spec.player.data.resources.H2.number = 10;
      spec.player.data.resources.O2.number = 5;
      
      spec.controller.update();
      
      expect(spec.player.data.resources.H2.number).toEqual(2);
      expect(spec.player.data.resources.O2.number).toEqual(1);
      expect(spec.player.data.resources.H2O.number).toEqual(8);
      expect(spec.player.data.resources.eV.number).toEqual(23.7);
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
    
    it("should process unstables", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.resources.O3.unlocked = true;
      spec.player.data.resources.O3.number = 1000;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      expect(spec.player.data.resources.O3.number).toEqual(1000);
      expect(spec.player.data.resources.O2.number).toEqual(0);
      expect(spec.player.data.resources.O.number).toEqual(0);
    });
    
    it("should process unstables 2", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.resources.O3.unlocked = true;
      spec.player.data.resources.O3.number = 1e6;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      // clear spec subscriber to avoid side effects
      spec.controller.checkUnlock();
      
      spec.controller.update();
      
      expect(spec.player.data.resources.O3.number).toEqual(999992);
      expect(spec.player.data.resources.O2.number).toEqual(8);
      expect(spec.player.data.resources.O.number).toEqual(8);
    });

    it("should process radicals", function() {
      spec.player.populatePlayer();
      spec.player.data = spec.player.startPlayer;
      spec.player.data.resources.O.unlocked = true;
      spec.player.data.resources.O.number = 1000;
      spec.player.data.resources.O.unlocked = true;
      spec.player.data.resources.O2.number = 1e8;
      spyOn(spec.controller.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.controller,'getPoisson').and.returnValue(0);
      
      spec.controller.update();
      
      // the logic is the following
      // we start with 1000 O. Out of those, 5% react (50)
      // the reactants are in total 1000 O and 1e8 O2
      // with reactivity 1e-6, 100 of O2 react with O
      // the sum is 1100, so we split 1000/1100 and 100/1100
      // for O we react around 90.9%, which is 45. However 45 is odd
      // so we adjust down to 44. 44 O generate 22 O2.
      // then we have 5 reactions of O with O2. We subtract them
      // and obtain the final values.
      expect(spec.player.data.resources.O.number).toEqual(951);
      expect(spec.player.data.resources.O2.number).toEqual(100000017);
      expect(spec.player.data.resources.O3.number).toEqual(5);
    });
  });

  describe('xxxxxxxxxxxxxxxx', function() {
    it("should ", function() {
      //value = spec.$scope.xxxxxx();
      
      //expect(value).toEqual('xxxxxx');
    });
  });
});
