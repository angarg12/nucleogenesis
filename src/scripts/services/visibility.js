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
      this.visible = function(items, func, currentElement) {
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
        return this.visible(data.elements, isElementVisible);
      };

      this.visibleResources = function(currentElement, type) {
        let resources = this.visible(data.resources, isResourceVisible, currentElement);
        // we use the type as a filter, e.g. 'ion', 'molecule'
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

      this.isUpgradeVisible = function(name, currentElement, upgrade) {
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
    }
  ]);
