describe("Upgrade service", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('purchase functions', function() {

    it("should purchase an upgrade if cost is met", function() {      
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources['1H'] = {number:110};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      spec.upgrade.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources['1H'].number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });
    
    it("should not purchase an upgrade if cost is not met", function() {      
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources['1H'] = {number:10};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:false};
      
      spec.upgrade.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources['1H'].number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(false);
    });
    
    it("should skip if the upgrade is already bought", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources['1H'] = {number:10};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades["Tier 1-1"] = {bought:true};
      
      spec.upgrade.buyUpgrade("Tier 1-1",'H');
      
      expect(spec.player.data.resources['1H'].number).toEqual(10);
      expect(spec.player.data.elements.H.upgrades["Tier 1-1"].bought).toEqual(true);
    });  

    it("should return the las tier upgrade price", function() {  
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};      
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};
      spec.state.current_element = 'H';
    
      value = spec.upgrade.lastUpgradeTierPrice('Tier 1');
      
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
      spec.state.current_element = 'H';
    
      value = spec.upgrade.lastUpgradeTierPrice('Tier 1');
      
      expect(value).toBeNull();
    });
  });
});