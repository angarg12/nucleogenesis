describe("Player service", function() {
  var spec = {};

  commonSpec(spec);

  describe('save and load', function() {
    var getItemSpy;

    beforeEach(function() {
      getItemSpy = spyOn(localStorage, "getItem");
      spyOn(localStorage, "setItem");
      spyOn(localStorage, "removeItem");
    });

    it("should save player data", function() {
      spec.savegame.lastSave = undefined;

      spec.savegame.save();

      expect(spec.savegame.lastSave).not.toBeUndefined();
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("should load player data", function() {
      localStorage.getItem.isSpy = false;
      getItemSpy.and.returnValue('{}');
      spec.savegame.lastSave = undefined;
      spyOn(spec.savegame, "reset");
      spyOn(spec.savegame, "versionControl");

      spec.savegame.load();

      expect(localStorage.getItem).toHaveBeenCalled();
      expect(spec.savegame.reset).not.toHaveBeenCalled();
      expect(spec.savegame.versionControl).toHaveBeenCalled();
    });

    it("should load player data and throw exception", function() {
      spec.savegame.lastSave = undefined;
      spyOn(spec.savegame, "reset");
      spyOn(spec.savegame, "versionControl");

      spec.savegame.load();

      expect(localStorage.getItem).toHaveBeenCalled();
      expect(spec.savegame.reset).toHaveBeenCalled();
      expect(spec.savegame.versionControl).not.toHaveBeenCalled();
    });

    it("should reset player without confirmation", function() {
      spec.savegame.lastSave = undefined;
      spyOn(spec.state, "init");

      spec.savegame.reset(false);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(spec.state.init).toHaveBeenCalled();
    });

    it("should reset player with confirmation", function() {
      spec.savegame.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(true);
      spyOn(spec.state, "init");

      spec.savegame.reset(true);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(spec.state.init).toHaveBeenCalled();
    });

    it("should not reset player if the confirmation rejets", function() {
      spec.savegame.lastSave = undefined;
      spyOn(window, "confirm").and.returnValue(false);
      spyOn(spec.state, "init");

      spec.savegame.reset(true);

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(spec.state.init).not.toHaveBeenCalled();
    });

    it("should export save", function() {
      spyOn(window, "btoa").and.returnValue("");

      spec.savegame.exportSave();

      expect(window.btoa).toHaveBeenCalled();
    });

    it("should import save", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(JSON, "parse").and.returnValue("{}");
      spyOn(spec.savegame, "versionControl");
      spyOn(spec.savegame, "save");

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(JSON.parse).toHaveBeenCalled();
      expect(spec.savegame.versionControl).toHaveBeenCalled();
      expect(spec.savegame.save).toHaveBeenCalled();
    });

    it("should not import if save is not presented", function() {
      spyOn(window, "prompt").and.returnValue("");
      spyOn(window, "atob").and.returnValue("{}");
      spyOn(spec.savegame, "versionControl");
      spyOn(spec.savegame, "save");

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).not.toHaveBeenCalled();
      expect(spec.savegame.versionControl).not.toHaveBeenCalled();
      expect(spec.savegame.save).not.toHaveBeenCalled();
    });

    it("should not import if save is invalid", function() {
      spyOn(window, "prompt").and.returnValue("test");
      spyOn(window, "atob");
      spyOn(spec.savegame, "versionControl");
      spyOn(spec.savegame, "save");

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(spec.savegame.versionControl).not.toHaveBeenCalled();
      expect(spec.savegame.save).not.toHaveBeenCalled();
    });

    it("should version control", function() {
      spec.savegame.versionControl();
    });
  });

  describe('populate player', function() {
    it("should populate a new player", function() {
      spec.player.populatePlayer();

      expect(spec.player.startPlayer.resources.H).toEqual({
        number : 15,
        is_new : true,
        unlocked : true
      });
      expect(spec.player.startPlayer.elements.H.unlocked).toEqual(true);
      expect(spec.player.startPlayer.elements.H.upgrades['Tier 1-1'].bought).toEqual(false);
      expect(spec.player.startPlayer.encyclopedia.hydrogen.is_new).toEqual(true);
      expect(spec.player.startPlayer.unlocks.hydrogen).toEqual(false);
      expect(spec.player.startPlayer.syntheses.H2O).toEqual({
        number : 0,
        active : 0,
        is_new : true
      });
    });
  });
});
