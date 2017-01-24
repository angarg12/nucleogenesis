angular
.module('incremental')
.service('data',
['$http',
'$q',
function($http, $q) {
	var self = this;
	self.$scope;

	this.loadData = function(){
	  var elements = $http.get('src/data/elements.json').then(function(response) {
	    self.$scope.elements = response.data;
	  },function errorCallback(response) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	  
	  var generators = $http.get('src/data/generators.json').then(function(response) {
		    self.$scope.generators = response.data;
	  },function errorCallback(response) {
		  	    // called asynchronously if an error occurs
		  	    // or server returns response with an error status.
		  	  });
	  
	  var upgrades = $http.get('src/data/upgrades.json').then(function(response) {
		    self.$scope.upgrades = response.data;
	  },function errorCallback(response) {
		  	    // called asynchronously if an error occurs
		  	    // or server returns response with an error status.
		  	  });

	  var encyclopedia = $http.get('src/data/encyclopedia.json').then(function(response) {
		    self.$scope.encyclopedia = response.data;
		  },function errorCallback(response) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });
	  
	  var periodic_table = $http.get('src/data/periodic_table.json').then(function(response) {
		    self.$scope.periodic_table = response.data;
	  },function errorCallback(response) {
		  	    // called asynchronously if an error occurs
		  	    // or server returns response with an error status.
		  	  });
	  return $q.all(elements,generators,upgrades,encyclopedia,periodic_table);
	};
	
	// FIXME: temporary until we get rid of scope
	this.setScope = function (scope){
	  self.$scope = scope;
	  
	self.$scope.visibleElements = function (){
	  elements = [];
	  for(var element in self.$scope.elements){
		  if(isElementVisible(element)){
			  elements.push(element);
		  }
	  }
	  return elements;
	};
	
	isElementVisible = function (element){
		if(self.$scope.elements[element].disabled){
			return false;
		}
	    return self.$scope.player.data.elements[element].unlocked;
	};
	
	self.$scope.elementHasNew = function (element){
        var includes = self.$scope.elements[element].includes;
        for ( var key in includes) {
          if (self.$scope.player.data.resources[includes[key]].unlocked && self.$scope.player.data.resources[includes[key]].is_new) {
            return true;
          }
        }
        for ( var key in self.$scope.reactions[element].synthesis) {
          if (self.$scope.synthesis[self.$scope.reactions[element].synthesis[key]].visible() &&
              self.$scope.player.data.synthesis[self.$scope.reactions[element].synthesis[key]].is_new) {
            return true;
          }
        }
        return false;
	};

  self.$scope.visibleGenerators = function(){
	  generators = [];
	  for(var generator in self.$scope.generators){
		  if(isGeneratorVisible(generator)){
			  generators.push(generator);
		  }
	  }
	  return generators;
  };
  
  isGeneratorVisible = function (name){
	  var generator = self.$scope.generators[name];
	  var condition = "";
	  for(var dep in generator.dependencies){
		  condition += "self.$scope.player.data.elements[self.$scope.current_element].generators['"+generator.dependencies[dep]+"'].level > 0"+" && ";
	  }
	  condition += "true";
	  return eval(condition);	  
  };

  // FIXME use eval for the time being, refactor to preprocess conditional functions
  
  self.$scope.visibleUpgrade = function(name){
	  var upgrade = self.$scope.upgrades[name];
	  var condition = "";
	  for(var pre in upgrade.preconditions){
		  condition += upgrade.preconditions[pre]+" && ";
	  }
	  for(var dep in upgrade.dependencies){
		  condition += "self.$scope.player.data.elements[self.$scope.current_element].upgrades['"+upgrade.dependencies[dep]+"'].bought"+" && ";
	  }
	  condition += "true";

	 return eval(condition);
  }
  
  self.$scope.upgradeApply = function(resource, power){
	  return resource * power;
  };

  self.$scope.resources = {
    'H' : {
      visible : function () {
        return self.$scope.current_element === "H" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.999884,
      type : 'element'
    },
    'H-' : {
      visible : function () {
        return self.$scope.current_element === "H" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['H-'].unlocked;
      },
      html : 'H<sup>-</sup>',
      type : 'ion',
      charge : +1
    },
    '2H' : {
      visible : function () {
        return self.$scope.current_element === "H" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['2H'].unlocked;
      },
      ratio : 0.000115,
      html : '<sup>2</sup>H',
      type : 'isotope'
    },
    '3H' : {
      visible : function () {
        return self.$scope.current_element === "H" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['3H'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>3</sup>H',
      type : 'isotope',
      decay : {
        half_life : 3.8852e+8,
        decay_type : 'beta-',
        decay_product : {
          '3He+1' : 1,
          'e-' : 1,
          'eV' : 18610
        }
      }
    },
    'H2' : {
      visible : function () {
        return self.$scope.current_element === "H" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources.H2.unlocked;
      },
      html : 'H<sub>2</sub>',
      type : 'molecule'
    },
    'He' : {
      visible : function () {
        return self.$scope.current_element === "He" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '3He' : {
      visible : function () {
        return self.$scope.current_element === "He" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['3He'].unlocked;
      },
      ratio : 0.000002,
      html : '<sup>3</sup>He',
      type : 'isotope',
    },
    '3He+1' : {
      visible : function () {
        return self.$scope.current_element === "He" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['3He+1'].unlocked;
      },
      html : '<sup>3</sup>He<sup>+</sup>',
      type : [ 'isotope', 'ion' ]
    },
    'Li' : {
      visible : function () {
        return self.$scope.current_element === "Li" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.95,
      type : 'element',
    },
    '7Li' : {
      visible : function () {
        return self.$scope.current_element === "Li" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['7Li'].unlocked;
      },
      ratio : 0.05,
      html : '<sup>7</sup>Li',
      type : 'isotope',
    },
    'Be' : {
      visible : function () {
        return self.$scope.current_element === "Be" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '7Be' : {
      visible : function () {
        return self.$scope.current_element === "Be" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['7Be'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>7</sup>Be',
      type : 'isotope',
      decay : {
        half_life : 4589568,
        decay_type : 'electron-capture',
        decay_product : {
          '7Li' : 1,
          'eV' : 862000
        }
      }
    },
    '10Be' : {
      visible : function () {
        return self.$scope.current_element === "Be" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['10Be'].unlocked;
      },
      ratio : 0.000001,
      type : 'isotope',
      html : '<sup>10</sup>Be',
      decay : {
        half_life : 4.2917e+14,
        decay_type : 'beta-',
        decay_product : {
          '10B' : 1,
          'e-' : 1,
          'eV' : 556000
        }
      }
    },
    'B' : {
      visible : function () {
        return self.$scope.current_element === "B" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.2,
      type : 'element',
    },
    '11B' : {
      visible : function () {
        return self.$scope.current_element === "B" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['11B'].unlocked;
      },
      ratio : 0.8,
      html : '<sup>11</sup>B',
      type : 'isotope',
    },
    'C' : {
      visible : function () {
        return self.$scope.current_element === "C" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.988998,
      type : 'element',
    },
    '11C' : {
      visible : function () {
        return self.$scope.current_element === "C" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['11C'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>11</sup>C',
      type : 'isotope',
      decay : {
        half_life : 1200,
        decay_type : 'beta+',
        decay_product : {
          '11B' : 1,
          'e+' : 1,
          'eV' : 96000
        }
      }
    },
    '13C' : {
      visible : function () {
        return self.$scope.current_element === "C" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['13C'].unlocked;
      },
      ratio : 0.011,
      html : '<sup>13</sup>C',
      type : 'isotope',
    },
    '14C' : {
      visible : function () {
        return self.$scope.current_element === "C" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['14C'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>14</sup>C',
      type : 'isotope',
      decay : {
        half_life : 1.807e+11,
        decay_type : 'beta-',
        decay_product : {
          '14N' : 1,
          'e-' : 1,
          'eV' : 156000
        }
      }
    },
    'N' : {
      visible : function () {
        return self.$scope.current_element === "N" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.959999,
      type : 'element',
    },
    '13N' : {
      visible : function () {
        return self.$scope.current_element === "N" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['13N'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>13</sup>N',
      type : 'isotope',
      decay : {
        half_life : 598,
        decay_type : 'electron-capture',
        decay_product : {
          '13C' : 1,
          'eV' : 2220000
        }
      }
    },
    '15N' : {
      visible : function () {
        return self.$scope.current_element === "N" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['15N'].unlocked;
      },
      ratio : 0.04,
      html : '<sup>15</sup>N',
      type : 'isotope',
    },
    'O' : {
      visible : function () {
        return self.$scope.current_element === "O" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.9976,
      type : 'element'
    },
    'O2' : {
      visible : function () {
        return self.$scope.current_element === "O" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources.O2.unlocked;
      },
      html : 'O<sub>2</sub>',
      type : 'molecule',
    },
    'O3' : {
      visible : function () {
        return self.$scope.current_element === "O" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources.O3.unlocked;
      },
      html : 'O<sub>3</sub>',
      type : 'molecule'
    },
    '17O' : {
      visible : function () {
        return self.$scope.current_element === "O" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['17O'].unlocked;
      },
      ratio : 0.00039,
      html : '<sup>17</sup>O',
      type : 'isotope'
    },
    '18O' : {
      visible : function () {
        return self.$scope.current_element === "O" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['18O'].unlocked;
      },
      ratio : 0.00201,
      html : '<sup>18</sup>O',
      type : 'isotope'
    },
    'H2O' : {
      visible : function () {
        return (self.$scope.current_element === "H" || self.$scope.current_element === "O") &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources.H2O.unlocked;
      },
      html : 'H<sub>2</sub>O',
      type : 'molecule'
    },
    'F' : {
      visible : function () {
        return self.$scope.current_element === "F" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.999998,
      type : 'element',
    },
    '18F' : {
      visible : function () {
        return self.$scope.current_element === "F" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['18F'].unlocked;
      },
      ratio : 0.000001,
      html : '<sup>18</sup>F',
      type : 'isotope',
      decay : {
        half_life : 6586,
        decay_type : 'beta+',
        decay_product : {
          '18O' : 1,
          'e+' : 1,
          'eV' : 634000
        }
      }
    },
    'Ne' : {
      visible : function () {
        return self.$scope.current_element === "Ne" && self.$scope.current_tab == "Elements";
      },
      ratio : 0.9048,
      type : 'element',
    },
    '21Ne' : {
      visible : function () {
        return self.$scope.current_element === "Ne" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['21Ne'].unlocked;
      },
      ratio : 0.0027,
      html : '<sup>21</sup>Ne',
      type : 'isotope',
    },
    '22Ne' : {
      visible : function () {
        return self.$scope.current_element === "Ne" &&
               self.$scope.current_tab == "Elements" &&
               self.$scope.player.data.resources['22Ne'].unlocked;
      },
      ratio : 0.0925,
      html : '<sup>22</sup>Ne',
      type : 'isotope',
    },
    'e-' : {
      visible : function () {
        return self.$scope.player.data.resources['e-'].unlocked;
      },
      type : 'subatomic'
    },
    'n' : {
      visible : function () {
        return self.$scope.player.data.resources.n.unlocked;
      },
      type : 'subatomic'
    },
    'p' : {
      visible : function () {
        return self.$scope.player.data.resources.p.unlocked;
      },
      type : 'subatomic'
    },
    'eV' : {
      visible : function () {
        return self.$scope.player.data.resources.eV.unlocked;
      },
      type : 'eV'
    }
  };

  self.$scope.radioisotopes = [ '3H' ];// ,'7Be','10Be','11C','14C','13N','18F'];

  self.$scope.tabs = {
    'Elements' : {
      visible : function () {
        return true;
      },
      has_new : function () {
        for ( var key in self.$scope.elements) {
          if (self.$scope.player.data.elements[key] !== undefined &&
        	  self.$scope.player.data.elements[key].unlocked &&
              self.$scope.elementHasNew(key)) {
            return true;
          }
        }
        var other = [ 'e-', 'n', 'p', 'eV' ];
        for ( var key in other) {
          if (self.$scope.player.data.resources[other[key]].unlocked && self.$scope.player.data.resources[other[key]].is_new) {
            return true;
          }
        }
        return false;
      },
    },
    'Encyclopedia' : {
      visible : function () {
        return self.$scope.player.data.intro.content;
      },
      has_new : function () {
        for ( var entry in self.$scope.player.data.encyclopedia) {
          if (isEncyclopediaEntryVisible(entry) && self.$scope.player.data.encyclopedia[entry].is_new) {
            return true;
          }
        }

        return false;
      },
    },
    'Periodic Table' : {
      visible : function () {
        return self.$scope.player.data.unlocks.periodic_table;
      },
      has_new : function () {
        return false;
      },
    },
    'Options' : {
      visible : function () {
        return self.$scope.player.data.intro.content;
      },
      has_new : function () {
        return false;
      },
    }
  };

  self.$scope.visibleEncyclopediaEntries = function (){
		  entries = [];
		  for(var entry in self.$scope.encyclopedia){
			  if(isEncyclopediaEntryVisible(entry)){
				  entries.push(entry);
			  }
		  }
		  return entries;
		};
		
	  isEncyclopediaEntryVisible = function (entry){
	    return self.$scope.player.data.unlocks[entry];
	};
	
  self.$scope.reactions = {
    'H' : {
      'ionization' : {
        1 : {
          reactant : {
            'eV' : 13.5984,
            'H' : 1
          },
          product : {
            'p' : 1,
            'e-' : 1
          },
          visible : function () {
            return self.$scope.player.data.unlocks.ionization_energy;
          }
        }
      },
      'electron_affinity' : {
        1 : {
          reactant : {
            'e-' : 1,
            'H' : 1
          },
          product : {
            'H-' : 1,
            'eV' : 0.7545
          },
          visible : function () {
            return self.$scope.player.data.unlocks.electron_affinity;
          }
        }
      },
      'binding_energy' : {
        1 : {
          reactant : {
            'eV' : 2224520,
            '2H' : 1
          },
          product : {
            'p' : 1,
            'n' : 1,
            'e-' : 1
          },
          visible : function () {
            return self.$scope.player.data.unlocks.nuclear_binding_energy && self.$scope.player.data.resources['2H'].unlocked;
          }
        },
        2 : {
          reactant : {
            'eV' : 2827266,
            '3H' : 1
          },
          product : {
            'p' : 1,
            'n' : 2,
            'e-' : 1
          },
          visible : function () {
            return self.$scope.player.data.unlocks.nuclear_binding_energy && self.$scope.player.data.resources['3H'].unlocked;
          }
        }
      },
      // We could create a function that checks for every synthesis if
      // one of the reactants is an isotope, ion or molecule of the element
      // However for the sake of a proof of concept that is beyond our scope
      'synthesis' : [ 'H-p', 'H2O' ]
    },
    'O' : {
      'ionization' : {},
      'electron_affinity' : {},
      'binding_energy' : {
        1 : {
          reactant : {
            'eV' : 128030000,
            'O' : 1
          },
          product : {
            'p' : 8,
            'n' : 8,
            'e-' : 8
          },
          visible : function () {
            return self.$scope.player.data.unlocks.nuclear_binding_energy && self.$scope.player.data.resources.O.unlocked;
          }
        },
        2 : {
          reactant : {
            'eV' : 131750000,
            '17O' : 1
          },
          product : {
            'p' : 8,
            'n' : 9,
            'e-' : 8
          },
          visible : function () {
            return self.$scope.player.data.unlocks.nuclear_binding_energy && self.$scope.player.data.resources['17O'].unlocked;
          }
        },
        3 : {
          reactant : {
            'eV' : 141170000,
            '18O' : 1
          },
          product : {
            'p' : 8,
            'n' : 10,
            'e-' : 8
          },
          visible : function () {
            return self.$scope.player.data.unlocks.nuclear_binding_energy && self.$scope.player.data.resources['18O'].unlocked;
          }
        }
      },
      'synthesis' : [ 'O3', 'O2-OO', 'H2O', 'O2O2-O3O' ]
    }
  };

  self.$scope.synthesis = {
    'H-p' : {
      reactant : {
        'H-' : 1,
        'p' : 1
      },
      product : {
        'H2' : 1,
        'eV' : 17.3705
      },
      visible : function () {
        return self.$scope.player.data.unlocks.synthesis &&
               self.$scope.player.data.resources['H-'].unlocked &&
               self.$scope.player.data.resources.p.unlocked &&
               self.$scope.current_element == "H";
      }
    },
    'O3' : {
      reactant : {
        'O3' : 1,
        'eV' : 4.43
      },
      product : {
        'O2' : 1,
        'O' : 1
      },
      visible : function () {
        return self.$scope.player.data.unlocks.synthesis &&
               self.$scope.player.data.resources.O3.unlocked &&
               self.$scope.player.data.resources.eV.unlocked &&
               self.$scope.current_element == "O";
      }
    },
    'O2-OO' : {
      reactant : {
        'O2' : 1,
        'eV' : 21.4219
      },
      product : {
        'O' : 2
      },
      visible : function () {
        return self.$scope.player.data.unlocks.synthesis &&
               self.$scope.player.data.resources.O2.unlocked &&
               self.$scope.player.data.resources.eV.unlocked &&
               self.$scope.current_element == "O";
      }
    },
    'O2O2-O3O' : {
      reactant : {
        'O2' : 2,
        'eV' : 18
      },
      product : {
        'O3' : 1,
        'O' : 1
      },
      visible : function () {
        return self.$scope.player.data.unlocks.synthesis &&
               self.$scope.player.data.resources.O2.unlocked &&
               self.$scope.player.data.resources.O3.unlocked &&
               self.$scope.player.data.resources.eV.unlocked &&
               self.$scope.current_element == "O";
      }
    },
    'H2O' : {
      reactant : {
        'H2' : 2,
        'O2' : 1
      },
      product : {
        'H2O' : 2,
        'eV' : 5.925
      },
      visible : function () {
        return self.$scope.player.data.unlocks.synthesis &&
               self.$scope.player.data.resources.O.number > 1e8 &&
               self.$scope.player.data.resources.H.number > 1e14 &&
               (self.$scope.current_element == "H" || self.$scope.current_element == "O");
      }
    }
  };

  self.$scope.html = {
    'beta-' : '&#946;<sup>-</sup>',
    'beta+' : '&#946;<sup>+</sup>',
    'electron-capture' : '&#x3B5'
  };

  self.$scope.unlocks = {
    "hydrogen" : {
      check : function (event, data) {
        // self.$scope.achievement.addToast("Periodic table");
        self.$scope.player.data.unlocks.hydrogen = true;
        self.$scope.unlocks.hydrogen.listener();
      },
      event : "cycle"
    },
    "periodic_table" : {
      check : function (event, data) {
        if (self.$scope.player.data.resources['e-'].unlocked &&
            self.$scope.player.data.resources.p.unlocked &&
            self.$scope.player.data.resources.n.unlocked) {
          self.$scope.achievement.addToast("Periodic table");
          self.$scope.player.data.unlocks.periodic_table = true;
          self.$scope.unlocks.periodic_table.listener();
        }
      },
      event : "cycle"
    },
    "isotope" : {
      check : function (event, data) {
        if ([ '2H', '3H' ].indexOf(data) != -1) {
          self.$scope.achievement.addToast("Isotope");
          self.$scope.player.data.unlocks.isotope = true;
          self.$scope.unlocks.isotope.listener();
        }
      },
      event : "resource"
    },
    "ion" : {
      check : function (event, data) {
        if ("H-" == data) {
          self.$scope.achievement.addToast("Ion");
          self.$scope.player.data.unlocks.ion = true;
          self.$scope.unlocks.ion.listener();
        }
      },
      event : "resource"
    },
    "radioactivity" : {
      check : function (event, data) {
        if ("3H" == data) {
          self.$scope.achievement.addToast("Radioactivity");
          self.$scope.player.data.unlocks.radioactivity = true;
          self.$scope.unlocks.radioactivity.listener();
        }
      },
      event : "resource"
    },
    "reactions" : {
      check : function (event, data) {
        if ("e-" == data) {
          self.$scope.achievement.addToast("Reactions");
          self.$scope.player.data.unlocks.reactions = true;
          self.$scope.unlocks.reactions.listener();
        }
      },
      event : "resource"
    },
    "electron" : {
      check : function (event, data) {
        if ("e-" == data) {
          self.$scope.achievement.addToast("Electron");
          self.$scope.player.data.unlocks.electron = true;
          self.$scope.unlocks.electron.listener();
        }
      },
      event : "resource"
    },
    "proton" : {
      check : function (event, data) {
        if ("p" == data) {
          self.$scope.achievement.addToast("Proton");
          self.$scope.player.data.unlocks.proton = true;
          self.$scope.unlocks.proton.listener();
        }
      },
      event : "resource"
    },
    "neutron" : {
      check : function (event, data) {
        if ("n" == data) {
          self.$scope.achievement.addToast("Neutron");
          self.$scope.player.data.unlocks.neutron = true;
          self.$scope.unlocks.neutron.listener();
        }
      },
      event : "resource"
    },
    "energy" : {
      check : function (event, data) {
        if ("eV" == data) {
          self.$scope.achievement.addToast("Energy");
          self.$scope.player.data.unlocks.energy = true;
          self.$scope.unlocks.energy.listener();
        }
      },
      event : "resource"
    },
    "half_life" : {
      check : function (event, data) {
        if ("3H" == data) {
          self.$scope.achievement.addToast("Half-life");
          self.$scope.player.data.unlocks.half_life = true;
          self.$scope.unlocks.half_life.listener();
        }
      },
      event : "resource"
    },
    "oxygen" : {
      check : function (event, data) {
        if ("O" == data) {
          self.$scope.achievement.addToast("Oxygen");
          self.$scope.player.data.unlocks.oxygen = true;
          self.$scope.unlocks.oxygen.listener();
        }
      },
      event : "element"
    },
    "upgrade" : {
      check : function (event, data) {
        if ("Tier 3" == data) {
          self.$scope.achievement.addToast("Upgrades");
          self.$scope.player.data.unlocks.upgrade = true;
          self.$scope.unlocks.upgrade.listener();
        }
      },
      event : "generator"
    },
    "ionization_energy" : {
      check : function (event, data) {
        if ("e-" == data) {
          self.$scope.achievement.addToast("Ionization energy");
          self.$scope.player.data.unlocks.ionization_energy = true;
          self.$scope.unlocks.ionization_energy.listener();
        }
      },
      event : "resource"
    },
    "electron_affinity" : {
      check : function (event, data) {
        if (self.$scope.player.data.resources['e-'].number >= 10 && self.$scope.player.data.resources.p.number >= 10) {
          self.$scope.achievement.addToast("Electron affinity");
          self.$scope.player.data.unlocks.electron_affinity = true;
          self.$scope.unlocks.electron_affinity.listener();
        }
      },
      event : "cycle"
    },
    "nuclear_binding_energy" : {
      check : function (event, data) {
        if (self.$scope.player.data.resources['e-'].number >= 100 && self.$scope.player.data.resources.p.number >= 100) {
          self.$scope.achievement.addToast("Nuclear binding energy");
          self.$scope.player.data.unlocks.nuclear_binding_energy = true;
          self.$scope.unlocks.nuclear_binding_energy.listener();
        }
      },
      event : "cycle"
    },
    "beta_decay" : {
      check : function (event, data) {
        if ("beta-" == data) {
          self.$scope.achievement.addToast("Beta decay");
          self.$scope.player.data.unlocks.beta_decay = true;
          self.$scope.unlocks.beta_decay.listener();
        }
      },
      event : "decay"
    },
    "molecule" : {
      check : function (event, data) {
        if ("H2" == data || "O2" == data || "O3" == data) {
          self.$scope.achievement.addToast("Molecule");
          self.$scope.player.data.unlocks.molecule = true;
          self.$scope.unlocks.molecule.listener();
        }
      },
      event : "resource"
    },
    "synthesis" : {
      check : function (event, data) {
        if (self.$scope.player.data.resources['H-'].number >= 10) {
          self.$scope.achievement.addToast("Synthesis");
          self.$scope.player.data.unlocks.synthesis = true;
          self.$scope.unlocks.synthesis.listener();
        }
      },
      event : "cycle"
    },
    "helium" : {
      check : function (event, data) {
        if ("He" == data) {
          self.$scope.achievement.addToast("Helium");
          self.$scope.player.data.unlocks.helium = true;
          self.$scope.unlocks.helium.listener();
        }
      },
      event : "element"
    },
    "lithium" : {
      check : function (event, data) {
        if ("Li" == data) {
          self.$scope.achievement.addToast("Lithium");
          self.$scope.player.data.unlocks.lithium = true;
          self.$scope.unlocks.lithium.listener();
        }
      },
      event : "element"
    },
    "beryllium" : {
      check : function (event, data) {
        if ("Be" == data) {
          self.$scope.achievement.addToast("Beryllium");
          self.$scope.player.data.unlocks.beryllium = true;
          self.$scope.unlocks.beryllium.listener();
        }
      },
      event : "element"
    },
    "boron" : {
      check : function (event, data) {
        if ("B" == data) {
          self.$scope.achievement.addToast("Boron");
          self.$scope.player.data.unlocks.boron = true;
          self.$scope.unlocks.boron.listener();
        }
      },
      event : "element"
    },
    "carbon" : {
      check : function (event, data) {
        if ("C" == data) {
          self.$scope.achievement.addToast("Carbon");
          self.$scope.player.data.unlocks.carbon = true;
          self.$scope.unlocks.carbon.listener();
        }
      },
      event : "element"
    },
    "nitrogen" : {
      check : function (event, data) {
        if ("N" == data) {
          self.$scope.achievement.addToast("Nitrogen");
          self.$scope.player.data.unlocks.nitrogen = true;
          self.$scope.unlocks.nitrogen.listener();
        }
      },
      event : "element"
    },
    "fluorine" : {
      check : function (event, data) {
        if ("F" == data) {
          self.$scope.achievement.addToast("Fluorine");
          self.$scope.player.data.unlocks.fluorine = true;
          self.$scope.unlocks.fluorine.listener();
        }
      },
      event : "element"
    },
    "neon" : {
      check : function (event, data) {
        if ("Ne" == data) {
          self.$scope.achievement.addToast("Neon");
          self.$scope.player.data.unlocks.neon = true;
          self.$scope.unlocks.neon.listener();
        }
      },
      event : "element"
    }
  };  
	};	
}]);
