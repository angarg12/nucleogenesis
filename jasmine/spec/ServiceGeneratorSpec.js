describe("Generator service", function() {
  var spec = {};

  commonSpec(spec);

  describe('purchase', function() {
    it("should return the price of a generator", function() {
      spec.player.data = {};
      spec.player.data.elements = {'H':{}};
      spec.player.data.elements.H = {'generators':{}};
      spec.player.data.elements.H.generators['Tier 1'] = {'level':5};

      value = spec.generator.generatorPrice('Tier 1','H');

      expect(value).toEqual(20);
    });

    it("should return the price of a generator 2", function() {
      spec.player.data = {};
      spec.player.data.elements = {'H':{}};
      spec.player.data.elements.H = {'generators':{}};
      spec.player.data.elements.H.generators['Tier 3'] = {'level':10};

      value = spec.generator.generatorPrice('Tier 3','H');

      expect(value).toEqual(1792);
    });

    it("should purchase as many generators as requested", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:65};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};

      spec.generator.buyGenerators("Tier 1",'H',3);

      expect(spec.player.data.resources.H.number).toEqual(2);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(8);
      expect(spec.$rootScope.$broadcast).toHaveBeenCalled();
    });

    it("should purchase as many generators as possible until money runs out requested", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:45};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};

      spec.generator.buyGenerators("Tier 1",'H',3);

      expect(spec.player.data.resources.H.number).toEqual(4);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(7);
      expect(spec.$rootScope.$broadcast).toHaveBeenCalled();
    });

    it("should not purchase negative generators", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};

      spec.generator.buyGenerators("Tier 1",'H',-10);

      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(5);
    });

    it("should not purchase generator if cost is not met", function() {
      spec.player.data = {elements:{},resources:{}};
      spec.player.data.resources.H = {number:10};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators["Tier 1"] = {level:5};

      spec.generator.buyGenerators("Tier 1",'H',10);

      expect(spec.player.data.resources.H.number).toEqual(10);
      expect(spec.player.data.elements.H.generators["Tier 1"].level).toEqual(5);
    });
  });

  describe('production functions', function() {
    it("should calculate the generator production", function() {
      spec.data.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};

      value = spec.generator.generatorProduction('Tier 1','H');

      expect(value).toEqual(6);
    });

    it("should calculate the tier production", function() {
      spec.data.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {upgrades:{},generators:{}};
      spec.player.data.elements.H.upgrades['Tier 1-1'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-2'] = {bought:true};
      spec.player.data.elements.H.upgrades['Tier 1-3'] = {bought:false};
      spec.player.data.elements.H.generators['Tier 1'] = {level:10};


      value = spec.generator.tierProduction('Tier 1','H');

      expect(value).toEqual(60);
    });

    it("should calculate the element production", function() {
      spec.data.generators['Tier 1'].upgrades = [];
      spec.data.generators['Tier 2'].upgrades = [];
      spec.data.generators['Tier 3'].upgrades = [];
      temp1 = spec.data.generators['Tier 1'];
      temp2 = spec.data.generators['Tier 2'];
      temp3 = spec.data.generators['Tier 3'];
      spec.data.generators = {};
      spec.data.generators['Tier 1'] = temp1;
      spec.data.generators['Tier 2'] = temp2;
      spec.data.generators['Tier 3'] = temp3;

      spec.player.data = {elements:{}};
      spec.player.data.elements.H = {generators:{}};
      spec.player.data.elements.H.generators['Tier 1'] = {level:1};
      spec.player.data.elements.H.generators['Tier 2'] = {level:1};
      spec.player.data.elements.H.generators['Tier 3'] = {level:1};

      value = spec.generator.elementProduction('H');

      expect(value).toEqual(91);
    });
  });
});
