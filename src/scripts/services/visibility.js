/**
 visibility
 Service that holds all functions that determine which elements are visible.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('visibility', ['state',
    function(state) {
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
      };

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
      };

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
    }
  ]);
