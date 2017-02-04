describe("Upgrade service", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('visibility functions', function() {
    it("should show visible elements", function() {
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {unlocked:true};
      spec.player.data.elements.C = {unlocked:false};
      spec.player.data.elements.O = {unlocked:false};
      spec.elements = {'H':{disabled:false},'C':{disabled:false},'O':{disabled:false}};
      
      var elements = spec.visibility.visibleElements();
      
      expect(elements).toEqual(['H']);
    });    
  });
});