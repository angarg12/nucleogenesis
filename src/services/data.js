angular.module('incremental').service(
'data',
['$http',
'$q',
function($http, $q) {
  var self = this;
  self.$scope;

  this.files = ["elements",
              "generators",
              "upgrades",
              "encyclopedia",
              "periodic_table",
              "resources",
              "unlocks",
              "radioisotopes",
              "html",
              "syntheses"];
  
  this.loadData = function() {
    var promises = this.files.map(function(file){
      return $http.get('src/data/'+file+'.json').then(function(response) {
        self.$scope[file] = response.data;
      });
    });
    
    return $q.all(promises);
  };

  // FIXME: temporary until we get rid of scope
  this.setScope = function(scope) {
    self.$scope = scope;

    self.$scope.table_resources = [ "e-", "n", "p" ];
    
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
      for( var key in self.$scope.reactions[element].syntheses) {
        if(self.$scope.syntheses[self.$scope.reactions[element].syntheses[key]].visible()
            && self.$scope.player.data.syntheses[self.$scope.reactions[element].syntheses[key]].is_new) {
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
      for( var key in self.$scope.table_resources) {
        if(self.$scope.player.data.resources[self.$scope.table_resources[key]].unlocked
            && self.$scope.player.data.resources[self.$scope.table_resources[key]].is_new) {
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
        'syntheses': [ 'H-p', 'H2O' ]
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
        'syntheses': [ 'O3', 'O2-OO', 'H2O', 'O2O2-O3O' ]
      }
    };

    self.$scope.visibleSyntheses = function() {
      syntheses = [];
      for( var entry in self.$scope.syntheses) {
        if(isSynthesisVisible(self.$scope.syntheses[entry])) {
          syntheses.push(entry);
        }
      }
      return syntheses;
    };

    isSynthesisVisible = function(entry) {
      if(!self.$scope.player.data.unlocks.synthesis){
        return false;
      }

      for(var reactant in entry.reactant){
        if(!self.$scope.player.data.resources[reactant].unlocked){
          return false;
        }
      }
      
      for(var element in entry.elements){
        if(self.$scope.current_element === entry.elements[element]){
          return true;
        }
      };
      
      return false;
    };

    self.$scope.checkUnlock = self.$scope.$on("unlocks", function (event, data){
      for(var unlock in self.$scope.unlocks){
        if(!self.$scope.player.unlocks[unlock]){
          item = self.$scope.unlocks[unlock];
          if(eval(item.condition)){
            self.$scope.achievement.addToast(item.name);
            self.$scope.player.data.unlocks[unlock] = true;
          }
        }
      }
    });
  };
} ]);
