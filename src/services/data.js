angular.module('incremental').service(
'data',
['$http',
'$q',
function($http, $q) {
  var self = this;
  self.$scope;

  this.loadData = function() {
    var elements = $http.get('src/data/elements.json').then(function(response) {
      self.$scope.elements = response.data;
    });

    var generators = $http.get('src/data/generators.json').then(function(response) {
      self.$scope.generators = response.data;
    });

    var upgrades = $http.get('src/data/upgrades.json').then(function(response) {
      self.$scope.upgrades = response.data;
    });

    var encyclopedia = $http.get('src/data/encyclopedia.json').then(function(response) {
      self.$scope.encyclopedia = response.data;
    });

    var periodic_table = $http.get('src/data/periodic_table.json').then(function(response) {
      self.$scope.periodic_table = response.data;
    });

    var resources = $http.get('src/data/resources.json').then(function(response) {
      self.$scope.resources = response.data;
    });
    
    return $q.all(elements, generators, upgrades, encyclopedia, periodic_table, resources);
  };

  // FIXME: temporary until we get rid of scope
  this.setScope = function(scope) {
    self.$scope = scope;

    self.$scope.radioisotopes = [ "3H" ];// ,"7Be","10Be","11C","14C","13N","18F"];

    self.$scope.table_resources = [ "e-", "n", "p" ];


    self.$scope.html = {
      'beta-': '&#946;<sup>-</sup>',
      'beta+': '&#946;<sup>+</sup>',
      'electron-capture': '&#x3B5'
    };
    
    self.$scope.visibleElements = function() {
      elements = [];
      for( var element in self.$scope.elements) {
        if(isElementVisible(element)) {
          elements.push(element);
        }
      }
      return elements;
    };

    isElementVisible = function(element) {
      if(self.$scope.elements[element].disabled) {
        return false;
      }
      return self.$scope.player.data.elements[element].unlocked;
    };

    self.$scope.elementHasNew = function(element) {
      var includes = self.$scope.elements[element].includes;
      for( var key in includes) {
        if(self.$scope.player.data.resources[includes[key]].unlocked
            && self.$scope.player.data.resources[includes[key]].is_new) {
          return true;
        }
      }
      for( var key in self.$scope.reactions[element].synthesis) {
        if(self.$scope.synthesis[self.$scope.reactions[element].synthesis[key]].visible()
            && self.$scope.player.data.synthesis[self.$scope.reactions[element].synthesis[key]].is_new) {
          return true;
        }
      }
      return false;
    };

    self.$scope.visibleGenerators = function() {
      generators = [];
      for( var generator in self.$scope.generators) {
        if(isGeneratorVisible(generator)) {
          generators.push(generator);
        }
      }
      return generators;
    };

    isGeneratorVisible = function(name) {
      var generator = self.$scope.generators[name];
      var condition = "";
      for( var dep in generator.dependencies) {
        condition += "self.$scope.player.data.elements[self.$scope.current_element].generators['"
            + generator.dependencies[dep] + "'].level > 0" + " && ";
      }
      condition += "true";
      return eval(condition);
    };

    // FIXME use eval for the time being, refactor to preprocess conditional functions

    self.$scope.visibleUpgrade = function(name) {
      var upgrade = self.$scope.upgrades[name];
      var condition = "";
      for( var pre in upgrade.preconditions) {
        condition += upgrade.preconditions[pre] + " && ";
      }
      for( var dep in upgrade.dependencies) {
        condition += "self.$scope.player.data.elements[self.$scope.current_element].upgrades['"
            + upgrade.dependencies[dep] + "'].bought" + " && ";
      }
      condition += "true";

      return eval(condition);
    }

    self.$scope.upgradeApply = function(resource, power) {
      return resource * power;
    };

    self.$scope.visibleResources = function() {
      resources = [];
      for( var resource in self.$scope.resources) {
        if(isResourceVisible(resource)) {
          resources.push(resource);
        }
      }
      return resources;
    };

    isResourceVisible = function(name) {
      if(!self.$scope.player.data.resources[name].unlocked){
        return false;
      }
      
      var elements = self.$scope.resources[name].elements;
      if(elements.length === 0){
        return true;
      }
      
      for(var element in elements){
        if(self.$scope.current_element == elements[element]){
          return true;
        }
      }
      
      return false;
    };
    
    self.$scope.elementsHasNew = function() {
      for( var key in self.$scope.elements) {
        if(self.$scope.player.data.elements[key] !== undefined
            && self.$scope.player.data.elements[key].unlocked && self.$scope.elementHasNew(key)) {
          return true;
        }
      }
      for( var key in table_resources) {
        if(self.$scope.player.data.resources[table_resources[key]].unlocked
            && self.$scope.player.data.resources[table_resources[key]].is_new) {
          return true;
        }
      }
      return false;
    };

    self.$scope.encyclopediaHasNew = function() {
      for( var entry in self.$scope.player.data.encyclopedia) {
        if(isEncyclopediaEntryVisible(entry) && self.$scope.player.data.encyclopedia[entry].is_new) {
          return true;
        }
      }
    };

    self.$scope.visibleEncyclopediaEntries = function() {
      entries = [];
      for( var entry in self.$scope.encyclopedia) {
        if(isEncyclopediaEntryVisible(entry)) {
          entries.push(entry);
        }
      }
      return entries;
    };

    isEncyclopediaEntryVisible = function(entry) {
      return self.$scope.player.data.unlocks[entry];
    };

    self.$scope.reactions = {
      'H': {
        'ionization': {
          1: {
            reactant: {
              'eV': 13.5984,
              'H': 1
            },
            product: {
              'p': 1,
              'e-': 1
            },
            visible: function() {
              return self.$scope.player.data.unlocks.ionization_energy;
            }
          }
        },
        'electron_affinity': {
          1: {
            reactant: {
              'e-': 1,
              'H': 1
            },
            product: {
              'H-': 1,
              'eV': 0.7545
            },
            visible: function() {
              return self.$scope.player.data.unlocks.electron_affinity;
            }
          }
        },
        'binding_energy': {
          1: {
            reactant: {
              'eV': 2224520,
              '2H': 1
            },
            product: {
              'p': 1,
              'n': 1,
              'e-': 1
            },
            visible: function() {
              return self.$scope.player.data.unlocks.nuclear_binding_energy
                  && self.$scope.player.data.resources['2H'].unlocked;
            }
          },
          2: {
            reactant: {
              'eV': 2827266,
              '3H': 1
            },
            product: {
              'p': 1,
              'n': 2,
              'e-': 1
            },
            visible: function() {
              return self.$scope.player.data.unlocks.nuclear_binding_energy
                  && self.$scope.player.data.resources['3H'].unlocked;
            }
          }
        },
        // We could create a function that checks for every synthesis if
        // one of the reactants is an isotope, ion or molecule of the element
        // However for the sake of a proof of concept that is beyond our scope
        'synthesis': [ 'H-p', 'H2O' ]
      },
      'O': {
        'ionization': {},
        'electron_affinity': {},
        'binding_energy': {
          1: {
            reactant: {
              'eV': 128030000,
              'O': 1
            },
            product: {
              'p': 8,
              'n': 8,
              'e-': 8
            },
            visible: function() {
              return self.$scope.player.data.unlocks.nuclear_binding_energy
                  && self.$scope.player.data.resources.O.unlocked;
            }
          },
          2: {
            reactant: {
              'eV': 131750000,
              '17O': 1
            },
            product: {
              'p': 8,
              'n': 9,
              'e-': 8
            },
            visible: function() {
              return self.$scope.player.data.unlocks.nuclear_binding_energy
                  && self.$scope.player.data.resources['17O'].unlocked;
            }
          },
          3: {
            reactant: {
              'eV': 141170000,
              '18O': 1
            },
            product: {
              'p': 8,
              'n': 10,
              'e-': 8
            },
            visible: function() {
              return self.$scope.player.data.unlocks.nuclear_binding_energy
                  && self.$scope.player.data.resources['18O'].unlocked;
            }
          }
        },
        'synthesis': [ 'O3', 'O2-OO', 'H2O', 'O2O2-O3O' ]
      }
    };

    self.$scope.synthesis = {
      'H-p': {
        reactant: {
          'H-': 1,
          'p': 1
        },
        product: {
          'H2': 1,
          'eV': 17.3705
        },
        visible: function() {
          return self.$scope.player.data.unlocks.synthesis && self.$scope.player.data.resources['H-'].unlocked
              && self.$scope.player.data.resources.p.unlocked && self.$scope.current_element == "H";
        }
      },
      'O3': {
        reactant: {
          'O3': 1,
          'eV': 4.43
        },
        product: {
          'O2': 1,
          'O': 1
        },
        visible: function() {
          return self.$scope.player.data.unlocks.synthesis && self.$scope.player.data.resources.O3.unlocked
              && self.$scope.player.data.resources.eV.unlocked && self.$scope.current_element == "O";
        }
      },
      'O2-OO': {
        reactant: {
          'O2': 1,
          'eV': 21.4219
        },
        product: {
          'O': 2
        },
        visible: function() {
          return self.$scope.player.data.unlocks.synthesis && self.$scope.player.data.resources.O2.unlocked
              && self.$scope.player.data.resources.eV.unlocked && self.$scope.current_element == "O";
        }
      },
      'O2O2-O3O': {
        reactant: {
          'O2': 2,
          'eV': 18
        },
        product: {
          'O3': 1,
          'O': 1
        },
        visible: function() {
          return self.$scope.player.data.unlocks.synthesis && self.$scope.player.data.resources.O2.unlocked
              && self.$scope.player.data.resources.O3.unlocked && self.$scope.player.data.resources.eV.unlocked
              && self.$scope.current_element == "O";
        }
      },
      'H2O': {
        reactant: {
          'H2': 2,
          'O2': 1
        },
        product: {
          'H2O': 2,
          'eV': 5.925
        },
        visible: function() {
          return self.$scope.player.data.unlocks.synthesis && self.$scope.player.data.resources.O.number > 1e8
              && self.$scope.player.data.resources.H.number > 1e14
              && (self.$scope.current_element == "H" || self.$scope.current_element == "O");
        }
      }
    };

    self.$scope.checkUnlock = self.$scope.$on("unlocks", function (event, data){
      for(var unlock in self.$scope.unlocks){
        alert(unlock)
        if(!self.$scope.player.unlocks[unlock]){
          item = self.$scope.unlocks[unlock];
          if(eval(item.condition)){
            self.$scope.achievement.addToast(item.name);
            self.$scope.player.data.unlocks[unlock] = true;
          }
        }
      }
    });
    
    self.$scope.unlocks = {
      "hydrogen": {
        name: "Hydrogen",
        condition: "'H-' == data",
        check: function(event, data) {
          self.$scope.achievement.addToast("Hydrogen");
          self.$scope.player.data.unlocks.hydrogen = true;
        },
      },
      "periodic_table": {
        name: "Periodic table",
        condition: "self.$scope.player.data.resources['e-'].unlocked && self.$scope.player.data.resources.p.unlocked && self.$scope.player.data.resources.n.unlocked"
      },
      "isotope": {
        name: "Isotope",
        condition: "[ '2H', '3H' ].indexOf(data) != -1"
      },
      "ion": {
        name: "Ion",
        condition: "'H-' == data"
      },
      "radioactivity": {
        name: "Radioactivity",
        condition: "'3H' == data"
      },
      "reactions": {
        name: "Reactions",
        condition: "'e-' == data"
      },
      "electron": {
        name: "Electron",
        condition: "'e-' == data"
      },
      "proton": {
        name: "Proton",
        condition: "'p' == data"
      },
      "neutron": {
        name: "Neutron",
        condition: "'n' == data"
      },
      "energy": {
        name: "Energy",
        condition: "'eV' == data"
      },
      "half_life": {
        name: "Half-life",
        condition: "'3H' == data"
      },
      "oxygen": {
        name: "Oxygen",
        condition: "'O' == data"
      },
      "upgrade": {
        name: "Upgrades",
        condition: "'Tier 3' == data"
      },
      "ionization_energy": {
        name: "Ionization energy",
        condition: "'e-'' == data"
      },
      "electron_affinity": {
        name: "Electron affinity",
        condition: "self.$scope.player.data.resources['e-'].number >= 10 && self.$scope.player.data.resources.p.number >= 10"
      },
      "nuclear_binding_energy": {
        name: "Nuclear binding energy",
        condition: "self.$scope.player.data.resources['e-'].number >= 100 && self.$scope.player.data.resources.p.number >= 100"
      },
      "beta_decay": {
        name: "Beta decay",
        condition: "'beta-' == data"
      },
      "molecule": {
        name: "Molecule",
        condition: "[ 'H2', 'O2' ,'O3' ].indexOf(data) != -1"
      },
      "synthesis": {
        name: "Synthesis",
        condition: "self.$scope.player.data.resources['H-'].number >= 10"
      },
      "helium": {
        name: "Helium",
        condition: "'He' == data"
      },
      "lithium": {
        name: "Lithium",
        condition: "'Li' == data"
      },
      "beryllium": {
        name: "Beryllium",
        condition: "'Be' == data"
      },
      "boron": {
        name: "Boron",
        condition: "'B' == data"
      },
      "carbon": {
        name: "Carbon",
        condition: "'C' == data"
      },
      "nitrogen": {
        name: "Nitrogen",
        condition: "'N' == data"
      },
      "fluorine": {
        name: "Fluorine",
        condition: "'F' == data"
      },
      "neon": {
        name: "Neon",
        condition: "'Ne' == data"
      }
    };
  };
} ]);
