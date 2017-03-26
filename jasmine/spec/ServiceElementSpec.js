describe("Element service", function() {
  var spec = {};

  commonSpec(spec);

  describe('prices and cost', function() {
    it("should calculate element price", function() {
      spec.player.data = {};
      spec.player.data.elements_unlocked = 1;

      value = spec.element.elementPrice('O');

      expect(value).toEqual(256);
    });

    it("should calculate element price 2", function() {
      spec.player.data = {};
      spec.player.data.elements_unlocked = 5;

      value = spec.element.elementPrice('Sn');

      // without the precision it doesn't work!!
      expect(value.toPrecision(6)).toBeCloseTo(8.0828128e+38.toPrecision(6),6);
    });

    it("should check if the cost of an element is met", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:0};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:300};

      value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it("should check if the cost of an element is met 2", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:0};
			spec.player.data.resources.n = {number:300};
      spec.player.data.elements_unlocked = 1;

      value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it("should check if the cost of an element is met 3", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:0};
      spec.player.data.elements_unlocked = 1;

      value = spec.element.isElementCostMet('O');

      expect(value).toEqual(false);
    });

    it("should check if the cost of an element is met 4", function() {
      spec.player.data = {};
      spec.player.data.resources = {};
      spec.player.data.resources['e-'] = {number:300};
			spec.player.data.resources.p = {number:300};
			spec.player.data.resources.n = {number:300};
      spec.player.data.elements_unlocked = 1;

      value = spec.element.isElementCostMet('O');

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

      spec.element.buyElement('O');

      expect(spec.player.data.resources['e-'].number).toEqual(0);
      expect(spec.player.data.resources.p.number).toEqual(1);
      expect(spec.player.data.resources.n.number).toEqual(2);
      expect(spec.player.data.elements.O.unlocked).toEqual(true);
      expect(spec.player.data.elements.O.generators["Tier 1"].level).toEqual(1);
      expect(spec.player.data.elements_unlocked).toEqual(2);
      expect(spec.$rootScope.$broadcast).toHaveBeenCalled();
    });

    it("should not purchase element if cost is not met", function() {
      spec.player.data = {elements:{},resources:{},elements_unlocked:2};
      spec.player.data.resources['e-'] = {number:256};
      spec.player.data.resources.p = {number:257};
      spec.player.data.resources.n = {number:258};
      spec.player.data.elements.O = {unlocked:false,generators:{}};
      spec.player.data.elements.O.generators["Tier 1"] = {level:0};

      spec.element.buyElement('O');

      expect(spec.player.data.resources['e-'].number).toEqual(256);
      expect(spec.player.data.resources.p.number).toEqual(257);
      expect(spec.player.data.resources.n.number).toEqual(258);
      expect(spec.player.data.elements.O.unlocked).toEqual(false);
      expect(spec.player.data.elements.O.generators["Tier 1"].level).toEqual(0);
      expect(spec.player.data.elements_unlocked).toEqual(2);
    });

    it("should skip if the element is already purchased", function() {
      spyOn(spec.element,'isElementCostMet');
      spec.player.data = {elements:{}};
      spec.player.data.elements.O = {unlocked:true};

      spec.element.buyElement('O');

      expect(spec.element.isElementCostMet).not.toHaveBeenCalled();
    });
  });
});
