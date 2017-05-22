'use strict';

angular
  .module('game')
  .service('visibility', ['state',
    'data',
    function (state, data) {
      let newElements = [];

      function visible(items, func, currentElement) {
        let visibles = [];
        for (let item in items) {
          if (func(item, currentElement)) {
            visibles.push(item);
          }
        }
        return visibles;
      }

      this.visibleElements = function () {
        return visible(data.elements, isElementVisible);
      };

      this.visibleGenerators = function (currentElement) {
        return visible(data.generators, isGeneratorVisible, currentElement);
      };

      this.visibleUpgrades = function (currentElement) {
        return visible(data.upgrades, isBasicUpgradeVisible, currentElement);
      };

      this.visibleExoticUpgrades = function (currentElement) {
        return visible(data.exotic_upgrades, isExoticUpgradeVisible, currentElement);
      };

      this.visibleDarkUpgrades = function (currentElement) {
        return visible(data.dark_upgrades, isDarkUpgradeVisible, currentElement);
      };

      this.visibleResources = function (currentElement) {
        return visible(data.resources, isResourceVisible, currentElement);
      };

      this.visibleEncyclopediaEntries = function () {
        return visible(data.encyclopedia, isEncyclopediaEntryVisible);
      };

      this.visibleRedox = function (currentElement) {
        return visible(data.redox, isRedoxVisible, currentElement);
      };

      this.visibleBindings = function (currentElement) {
        return visible(data.binding_energy, isBindingVisible, currentElement);
      };

      this.visibleSyntheses = function (currentElement) {
        return visible(data.syntheses, isSynthesisVisible, currentElement);
      };

      function isElementVisible(element) {
        if (data.elements[element].disabled) {
          return false;
        }

        for (let resource of data.elements[element].includes) {
          if (state.player.resources[resource].unlocked) {
            return true;
          }
        }

        return false;
      }

      function isGeneratorVisible(name, currentElement) {
        let generator = data.generators[name];
        for (let dep of generator.deps) {
          if(state.player.elements[currentElement].generators[dep] === 0){
            return false;
          }
        }

        return true;
      }

      function isBasicUpgradeVisible(name, currentElement) {
        return isUpgradeVisible(name, currentElement, data.upgrades[name]);
      }

      function isExoticUpgradeVisible(name, currentElement) {
        return isUpgradeVisible(name, currentElement, data.exotic_upgrades[name]);
      }

      function isDarkUpgradeVisible(name, currentElement) {
        return isUpgradeVisible(name, currentElement, data.dark_upgrades[name]);
      }

      function meetDependencies(upgrades, dependencies){
        if(!dependencies){
          return true;
        }
        for (let dep of dependencies) {
          if(!upgrades[dep]){
            return false;
          }
        }
        return true;
      }

      function isUpgradeVisible(name, currentElement, upgrade) {
        if(upgrade.tiers){
          for (let tier of upgrade.tiers) {
            if(state.player.elements[currentElement].generators[tier] === 0){
              return false;
            }
          }
        }
        return meetDependencies(state.player.elements[currentElement].upgrades, upgrade.deps) &&
        meetDependencies(state.player.elements[currentElement].exotic_upgrades, upgrade.exotic_deps) &&
        meetDependencies(state.player.dark_upgrades, upgrade.dark_deps);
      }

      function isResourceVisible(name, currentElement) {
        if (!state.player.resources[name].unlocked) {
          return false;
        }

        // This is for global resources e.g. protons, which do not
        // belong to any element
        let elements = data.resources[name].elements;
        if (Object.keys(elements).length === 0) {
          return true;
        }

        for (let element in elements) {
          if (currentElement === element) {
            return true;
          }
        }

        return false;
      }

      function isEncyclopediaEntryVisible(entry) {
        return state.player.achievements[entry];
      }

      function isReactionVisible(entry, currentElement, reaction) {
        if (!state.player.achievements[reaction]) {
          return false;
        }

        for (let reactant in entry.reactant) {
          if (!state.player.resources[reactant].unlocked) {
            return false;
          }
        }

        for (let element in entry.elements) {
          if (currentElement === entry.elements[element]) {
            return true;
          }
        }

        return false;
      }

      function isRedoxVisible(entry, currentElement) {
        return isReactionVisible(data.redox[entry], currentElement, 'redox');
      }

      function isBindingVisible(entry, currentElement) {
        return isReactionVisible(data.binding_energy[entry], currentElement, 'nuclear_binding_energy');
      }

      function isSynthesisVisible(entry, currentElement) {
        return isReactionVisible(data.syntheses[entry], currentElement, 'synthesis');
      }

      this.elementHasNew = function (element) {
        let includes = data.elements[element].includes;
        for (let key in includes) {
          if (this.hasNew(includes[key])) {
            return true;
          }
        }
        return false;
      };

      this.encyclopediaHasNew = function () {
        for (let entry in data.encyclopedia) {
          if (this.hasNew(entry)) {
            return true;
          }
        }
        return false;
      };

      this.hasNew = function (entry) {
        return newElements.indexOf(entry) !== -1;
      };

      this.addNew = function (entry) {
        newElements.push(entry);
      };

      this.removeNew = function (entry) {
        if (newElements.indexOf(entry) !== -1) {
          newElements.splice(newElements.indexOf(entry), 1);
        }
      };
    }
  ]);
