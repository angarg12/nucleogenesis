describe("Format service", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('formatting functions', function() {    
    it("should format reactions", function() {
      value = spec.format.reactionFormat(1, spec.data.syntheses['H-p']);
      
      expect(value).toEqual('H<sup>-</sup> + p <span class=\"icon\">&#8594;</span> H<sub>2</sub> + 17.3705 eV');
    });
      
    it("should format multiple reactions", function() {
      value = spec.format.reactionFormat(10, spec.data.syntheses['H-p']);
      
      expect(value).toEqual('10 H<sup>-</sup> + 10 p <span class=\"icon\">&#8594;</span> 10 H<sub>2</sub> + 173.705 eV');
    });
    
    it("should format single compounds", function() {
      value = spec.format.compoundFormat(1, spec.data.syntheses['H-p'].product);
      
      expect(value).toEqual('H<sub>2</sub> + 17.3705 eV');
    });
    
    it("should format mutiple compounds", function() {
      value = spec.format.compoundFormat(10, spec.data.syntheses['H-p'].product);
      
      expect(value).toEqual('10 H<sub>2</sub> + 173.705 eV');
    });
  
    it("should format decay", function() {
      value = spec.format.decayFormat(spec.data.resources['3H'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span><sup>3</sup>He<sup>+</sup> + e- + 18,610 eV');
    }); 
    
    it("should format decay without energy", function() {
      delete spec.data.resources['3H'].decay.decay_product.eV;
    
      value = spec.format.decayFormat(spec.data.resources['3H'].decay);
      
      expect(value).toEqual('<span class="icon">&#8594;</span><sup>3</sup>He<sup>+</sup> + e-');
    });
  });
});