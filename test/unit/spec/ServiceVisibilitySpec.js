/* globals describe,commonSpec,it,expect */
// jshint varstmt: false
'use strict';

describe('Visible service', function() {
  var spec = {};

  commonSpec(spec);

  describe('visibility functions', function() {
    it('should show visible elements', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.data.elements = {'H':{disabled:false},'C':{disabled:true},'O':{disabled:false}};
      spec.state.player.elements.H = {unlocked:true};
      spec.data.elements.H.includes = ['1H'];
      spec.state.player.elements.C = {unlocked:false};
      spec.data.elements.C.includes = ['8C'];
      spec.state.player.elements.O = {unlocked:false};
      spec.data.elements.O.includes = ['16O'];
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.C = {unlocked:false};
      spec.state.player.resources['16O'] = {unlocked:false};

      var values = spec.visibility.visibleElements();

      expect(values).toEqual(['H']);
    });

    it('should show visible generators', function() {
      spec.state.player = {elements:{}};
      spec.state.player.elements.H = {generators:[]};
      spec.state.player.elements.H.generators['Tier 1'] = 1;
      spec.state.player.elements.H.generators['Tier 2'] = 0;
      spec.state.player.elements.H.generators['Tier 3'] = 0;
      var temp = spec.data.generators;
      spec.data.generators = {};
      spec.data.generators['Tier 1'] = temp['Tier 1'];
      spec.data.generators['Tier 2'] = temp['Tier 2'];
      spec.data.generators['Tier 3'] = temp['Tier 3'];

      var values = spec.visibility.visibleGenerators('H');

      expect(values).toEqual(['Tier 1', 'Tier 2']);
    });

    it('should show if an upgrade is visible', function() {
      spec.state.player = {elements:{}, achievements:{}};
      spec.state.player.achievements = {upgrade:true};
      spec.state.player.elements.H = {generators:[],upgrades:[]};
      spec.state.player.elements.H.generators['Tier 1'] = 1;
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = false;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;
      var temp = spec.data.upgrades;
      spec.data.upgrades = {};
      spec.data.upgrades['Tier 1-1'] = temp['Tier 1-1'];
      spec.data.upgrades['Tier 1-2'] = temp['Tier 1-2'];
      spec.data.upgrades['Tier 1-3'] = temp['Tier 1-3'];

      var values = spec.visibility.isUpgradeVisible('Tier 1-1', 'H');

      expect(values).toBeTruthy();
    });

    it('should show if an upgrade is visible 2', function() {
      spec.state.player = {elements:{}, achievements:{}};
      spec.state.player.achievements = {upgrade:true};
      spec.state.player.elements.H = {generators:[],upgrades:[]};
      spec.state.player.elements.H.generators['Tier 1'] = 1;
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = false;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;
      var temp = spec.data.upgrades;
      spec.data.upgrades = {};
      spec.data.upgrades['Tier 1-1'] = temp['Tier 1-1'];
      spec.data.upgrades['Tier 1-2'] = temp['Tier 1-2'];
      spec.data.upgrades['Tier 1-3'] = temp['Tier 1-3'];

      var values = spec.visibility.isUpgradeVisible('Tier 1-2', 'H');

      expect(values).toBeTruthy();
    });

    it('should show if an upgrade is not visible', function() {
      spec.state.player = {elements:{}, achievements:{}};
      spec.state.player.achievements = {upgrade:true};
      spec.state.player.elements.H = {generators:[],upgrades:[]};
      spec.state.player.elements.H.generators['Tier 1'] = 1;
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = false;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;
      var temp = spec.data.upgrades;
      spec.data.upgrades = {};
      spec.data.upgrades['Tier 1-1'] = temp['Tier 1-1'];
      spec.data.upgrades['Tier 1-2'] = temp['Tier 1-2'];
      spec.data.upgrades['Tier 1-3'] = temp['Tier 1-3'];

      var values = spec.visibility.isUpgradeVisible('Tier 1-3', 'H');

      expect(values).toBeFalsy();
    });

    it('should show visible resources', function() {
      spec.state.player = {resources:{}};
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources['2H'] = {unlocked:false};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['16O']= {unlocked:true};
      var temp = spec.data.resources;
      spec.data.resources = {};
      spec.data.resources['1H'] = temp['1H'];
      spec.data.resources['2H'] = temp['2H'];
      spec.data.resources['eV'] = temp['eV'];
      spec.data.resources['16O'] = temp['16O'];

      var values = spec.visibility.visibleResources('H');

      expect(values).toEqual(['1H', 'eV']);
    });

    it('should show visible encyclopedia entries', function() {
      spec.state.player = {achievements:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.hydrogen = true;
      spec.state.player.achievements.oxygen = false;
      var temp = spec.data.encyclopedia;
      spec.data.encyclopedia = {};
      spec.data.encyclopedia.hydrogen = temp.hydrogen;
      spec.data.encyclopedia.oxygen = temp.oxygen;

      var values = spec.visibility.visibleEncyclopediaEntries();

      expect(values).toEqual(['hydrogen']);
    });

    it('should show visible redoxes', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = true;
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['e-'] = {unlocked:false};

      var values = spec.visibility.visibleRedox('H');

      expect(values).toEqual(['1H+']);
    });

    it('should not show redoxes if they are locked', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = false;
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['e-'] = {unlocked:false};

      var values = spec.visibility.visibleRedox('H');

      expect(values).toEqual([]);
    });

    it('should not show redoxes of other elements', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = true;
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['e-'] = {unlocked:false};

      var values = spec.visibility.visibleRedox('O');

      expect(values).toEqual([]);
    });

    it('should show visible bindings', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.nuclear_binding_energy = true;
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['2H'] = {unlocked:true};
      spec.state.player.resources['3H'] = {unlocked:false};
      var temp = spec.data.binding_energy;
      spec.data.binding_energy = {};
      spec.data.binding_energy['2H'] = temp['2H'];
      spec.data.binding_energy['3H'] = temp['3H'];

      var values = spec.visibility.visibleBindings('H');

      expect(values).toEqual(['2H']);
    });

    it('should show visible syntheses', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.synthesis = true;
      spec.state.player.resources['1H-'] = {unlocked:true};
      spec.state.player.resources.p = {unlocked:true};
      spec.state.player.resources.H2 = {unlocked:true};
      spec.state.player.resources.O2 = {unlocked:false};
      spec.data.syntheses = {};
      spec.data.syntheses['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      spec.data.syntheses['H2O'] = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      var values = spec.visibility.visibleSyntheses('H');

      expect(values).toEqual(['1H-p']);
    });
  });

  describe('has new functions', function() {
    it('should return true if any element has new items', function() {
      spec.data.elements.H.includes = ['1H'];
      spec.visibility.addNew('1H');

      var hasNew = spec.visibility.elementsHasNew();
      expect(hasNew).toBeTruthy();
    });

    it('should return true if an element has new items', function() {
      spec.data.elements.H.includes = ['1H'];
      spec.visibility.addNew('1H');

      var hasNew = spec.visibility.elementHasNew('H');
      expect(hasNew).toBeTruthy();
    });

    it('should return false if an element has no new items', function() {
      spec.data.elements.H.includes = ['2H','3H','1H-'];

      var hasNew = spec.visibility.elementHasNew('H');
      expect(hasNew).toBeFalsy();
    });

    it('should return true if there are new encyclopedia entries', function() {
      var temp = spec.data.encyclopedia;
      spec.data.encyclopedia = {};
      spec.data.encyclopedia.hydrogen = temp.hydrogen;
      spec.data.encyclopedia.oxygen = temp.oxygen;
      spec.visibility.addNew('hydrogen');
      spec.visibility.addNew('oxygen');

      var hasNew = spec.visibility.encyclopediaHasNew();

      expect(hasNew).toBeTruthy();
    });

    it('should return false if there are no new encyclopedia entries', function() {
      var temp = spec.data.encyclopedia;
      spec.data.encyclopedia = {};
      spec.data.encyclopedia.hydrogen = temp.hydrogen;
      spec.data.encyclopedia.oxygen = temp.oxygen;

      var hasNew = spec.visibility.encyclopediaHasNew();

      expect(hasNew).toBeFalsy();
    });
  });
});
