/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Visible service', function() {
  let spec = {};

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
      spec.state.player.resources['8C'] = {unlocked:false};
      spec.state.player.resources['16O'] = {unlocked:false};

      let values = spec.visibility.visibleElements();

      expect(values).toEqual(['H']);
    });

    it('should show visible generators', function() {
      spec.state.player = {elements:{}};
      spec.state.player.elements.H = {generators:[]};
      spec.state.player.elements.H.generators['1'] = 1;
      spec.state.player.elements.H.generators['2'] = 0;
      spec.state.player.elements.H.generators['3'] = 0;
      let temp = spec.data.generators;
      spec.data.generators = {};
      spec.data.generators['1'] = temp['1'];
      spec.data.generators['2'] = temp['2'];
      spec.data.generators['3'] = temp['3'];

      let values = spec.visibility.visibleGenerators('H');

      expect(values).toEqual(['1', '2']);
    });

    it('should show if an upgrade is visible', function() {
      spec.state.player = {elements:{}, achievements:{}};
      spec.state.player.achievements = {upgrade:1};
      spec.state.player.elements.H = {generators:[],upgrades:[],exotic_upgrades:[]};
      spec.state.player.elements.H.generators['1'] = 1;
      spec.state.player.elements.H.upgrades['1-1'] = true;
      spec.state.player.elements.H.upgrades['1-2'] = false;
      spec.state.player.elements.H.upgrades['1-3'] = false;
      spec.state.player.elements.H.exotic_upgrades.x3 = false;
      spec.state.player.elements.H.generators['2'] = 0;
      spec.state.player.elements.H.upgrades['2-1'] = false;
      let temp = spec.data.upgrades;
      spec.data.upgrades = {};
      spec.data.upgrades['1-1'] = temp['1-1'];
      spec.data.upgrades['1-2'] = temp['1-2'];
      spec.data.upgrades['1-3'] = temp['1-3'];
      spec.data.upgrades['2-1'] = temp['2-1'];

      let values = spec.visibility.visibleUpgrades('H');

      expect(values).toEqual(['1-1']);
    });

    it('should show if an upgrade is visible 2', function() {
      spec.state.player = {elements:{}, achievements:{}};
      spec.state.player.achievements = {upgrade:1};
      spec.state.player.elements.H = {generators:[],upgrades:[],exotic_upgrades:[]};
      spec.state.player.elements.H.generators['1'] = 1;
      spec.state.player.elements.H.upgrades['1-1'] = true;
      spec.state.player.elements.H.upgrades['1-2'] = false;
      spec.state.player.elements.H.upgrades['1-3'] = false;
      spec.state.player.elements.H.exotic_upgrades.x3 = true;
      spec.state.player.elements.H.generators['2'] = 0;
      spec.state.player.elements.H.upgrades['2-1'] = false;
      let temp = spec.data.upgrades;
      spec.data.upgrades = {};
      spec.data.upgrades['1-1'] = temp['1-1'];
      spec.data.upgrades['1-2'] = temp['1-2'];
      spec.data.upgrades['1-3'] = temp['1-3'];
      spec.data.upgrades['2-1'] = temp['2-1'];

      let values = spec.visibility.visibleUpgrades('H');

      expect(values).toEqual(['1-1','1-2']);
    });

    it('should show if an exotic upgrade is visible', function() {
      spec.state.player = spec.data.start_player;
      let temp = spec.data.exotic_upgrades;
      spec.data.exotic_upgrades = {};
      spec.data.exotic_upgrades.x3 = temp.x3;

      let values = spec.visibility.visibleExoticUpgrades('H');

      expect(values).toEqual(['x3']);
    });

    it('should show if an exotic upgrade is visible', function() {
      spec.state.player = spec.data.start_player;
      let temp = spec.data.dark_upgrades;
      spec.data.dark_upgrades = {};
      spec.data.dark_upgrades.table = temp.table;

      let values = spec.visibility.visibleDarkUpgrades('H');

      expect(values).toEqual(['table']);
    });

    it('should show visible resources', function() {
      spec.state.player = {resources:{}};
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources['2H'] = {unlocked:false};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['16O']= {unlocked:true};
      let temp = spec.data.resources;
      spec.data.resources = {};
      spec.data.resources['1H'] = temp['1H'];
      spec.data.resources['2H'] = temp['2H'];
      spec.data.resources.eV = temp.eV;
      spec.data.resources['16O'] = temp['16O'];

      let values = spec.visibility.visibleResources('H');

      expect(values).toEqual(['1H', 'eV']);
    });

    it('should show visible encyclopedia entries', function() {
      spec.state.player = {achievements:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.hydrogen = 1;
      spec.state.player.achievements.oxygen = 0;
      let temp = spec.data.encyclopedia;
      spec.data.encyclopedia = {};
      spec.data.encyclopedia.hydrogen = temp.hydrogen;
      spec.data.encyclopedia.oxygen = temp.oxygen;

      let values = spec.visibility.visibleEncyclopediaEntries();

      expect(values).toEqual(['hydrogen']);
    });

    it('should show visible redoxes', function() {
      spec.state.player = {redox:[], achievements:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = 1;
      spec.state.player.redox.push({
        resource: '1H',
        number: 50,
        active: false,
        element: 'H',
        from: 0,
        to: 1
      });
      spec.state.player.redox.push({
        resource: '16O',
        number: 50,
        active: false,
        element: 'O',
        from: 0,
        to: 1
      });

      let values = spec.visibility.visibleRedox('H');

      expect(values).toEqual([{
        resource: '1H',
        number: 50,
        active: false,
        element: 'H',
        from: 0,
        to: 1
      }]);
    });

    it('should not show redoxes if they are locked', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = 0;
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['e-'] = {unlocked:false};

      let values = spec.visibility.visibleRedox('H');

      expect(values).toEqual([]);
    });

    it('should not show redoxes of other elements', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.redox = 1;
      spec.state.player.resources['1H'] = {unlocked:true};
      spec.state.player.resources.eV = {unlocked:true};
      spec.state.player.resources['e-'] = {unlocked:false};

      let values = spec.visibility.visibleRedox('O');

      expect(values).toEqual([]);
    });

    it('should show visible reactions', function() {
      spec.state.player = {achievements:{},resources:{}};
      spec.state.player.achievements = {};
      spec.state.player.achievements.reaction = 1;
      spec.state.player.resources['1H-'] = {unlocked:true};
      spec.state.player.resources.p = {unlocked:true};
      spec.state.player.resources.H2 = {unlocked:true};
      spec.state.player.resources.O2 = {unlocked:false};
      spec.data.reactions = {};
      spec.data.reactions['1H-p'] = {
        'reactant': {'1H-':1,'p':1},
        'product': {'H2':1},
        'elements': [ 'H' ]
      };
      spec.data.reactions.H2O = {
        'reactant': {'H2':2,'O2':1},
        'product': {'H2O':2},
        'elements': ['H','O']
      };

      let values = spec.visibility.visibleSyntheses('H');

      expect(values).toEqual(['1H-p']);
    });
  });
});
