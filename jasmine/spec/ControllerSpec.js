describe("Incremental table elements", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('initialization functions', function() {    
    it("should init all the variables", function() {
      spyOn(spec.player, "populatePlayer");
      spyOn(spec.achievement, "initializeListeners");
      
      spec.$scope.init();
      
	  expect(spec.$scope.current_tab).toEqual("Elements");
	  expect(spec.$scope.current_entry).toEqual("Hydrogen");
	  expect(spec.$scope.current_element).toEqual("H");
	  expect(spec.$scope.hover_element).toEqual("");
	  expect(spec.achievement.toast).toEqual([]);
	  expect(spec.achievement.is_toast_visible).toEqual(false);
	  expect(spec.player.populatePlayer).toHaveBeenCalled();
	  expect(spec.achievement.initializeListeners).toHaveBeenCalled();
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
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);
      
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
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);
      
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
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);
      
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
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(0);
      
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
      spyOn(spec.util.numberGenerator,'nextGaussian').and.returnValue(0);
      spyOn(spec.util,'getPoisson').and.returnValue(18);
      
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
