/**
 visibility
 Service that holds all functions that determine which elements are visible.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('visibility', ['state',
    'data',
    function(state, data) {

      function visible(items, func, currentElement) {
        let visibles = [];
        for (let i in items) {
          // if it is an array, we need to extract the item from the index
          let item = Array.isArray(items) ? items[i] : i;
          if (func(item, currentElement)) {
            visibles.push(item);
          }
        }
        return visibles;
      }

      this.visibleElements = function() {
        return visible(data.elements, isElementVisible);
      };

      this.visibleGenerators = function(currentElement) {
        return visible(data.generators, isGeneratorVisible, currentElement);
      };

      this.visibleUpgrades = function(currentElement) {
        return visible(data.upgrades, isBasicUpgradeVisible, currentElement);
      };

      this.visibleExoticUpgrades = function(currentElement) {
        return visible(data.exotic_upgrades, isExoticUpgradeVisible, currentElement);
      };

      this.visibleDarkUpgrades = function(currentElement) {
        return visible(data.dark_upgrades, isDarkUpgradeVisible, currentElement);
      };

      this.visibleResources = function(currentElement, type) {
        let resources = visible(data.resources, isResourceVisible, currentElement);
        if(type){
          let filteredResources = [];
          for(let resource of resources){
            if(data.resources[resource].type &&
               data.resources[resource].type.indexOf(type) !== -1){
                filteredResources.push(resource);
            }
          }
          return filteredResources;
        }
        return resources;
      };

      this.visibleEncyclopediaEntries = function() {
        return visible(data.encyclopedia, isEncyclopediaEntryVisible);
      };

      this.visibleRedox = function(currentElement) {
        return visible(state.player.redox, isRedoxVisible, currentElement);
      };

      this.visibleSyntheses = function(currentElement) {
        return visible(data.reactions, isSynthesisVisible, currentElement);
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
          if (state.player.elements[currentElement].generators[dep] === 0) {
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

      function meetDependencies(upgrades, dependencies) {
        if (!dependencies) {
          return true;
        }
        for (let dep of dependencies) {
          if (!upgrades[dep]) {
            return false;
          }
        }
        return true;
      }

      function isUpgradeVisible(name, currentElement, upgrade) {
        if (upgrade.tiers) {
          for (let tier of upgrade.tiers) {
            if (state.player.elements[currentElement].generators[tier] === 0) {
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

        // for misc reactions
        if(entry.elements.length === 0 &&
           currentElement === ''){
             return true;
        }

        for (let element in entry.elements) {
          if (currentElement === entry.elements[element]) {
            return true;
          }
        }

        return false;
      }

      function isRedoxVisible(entry, currentElement) {
        return entry.element === currentElement;
      }

      function isSynthesisVisible(entry, currentElement) {
        return isReactionVisible(data.reactions[entry], currentElement, 'reaction');
      }
    }
  ]);
