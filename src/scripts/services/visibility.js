/**
 visibility
 Service that holds all functions that determine which elements are visible.

 @namespace Services
 */
'use strict';

angular
  .module('game')
  .service('visibility', [
    function() {
      this.visible = function(items, func, currentElement, sortFunc, player) {
        let visibles = [];
        for (let i in items) {
          // if it is an array, we need to extract the item from the index
          let item = Array.isArray(items) ? items[i] : i;
          if (func(item, currentElement, player)) {
            visibles.push(item);
          }
        }
        if(sortFunc){
          visibles.sort(sortFunc);
        }
        return visibles;
      };

      this.isUpgradeVisible = function(name, slot, upgrade, player) {
        if (upgrade.tiers) {
          for (let tier of upgrade.tiers) {
            if (slot.generators[tier] === 0) {
              return false;
            }
          }
        }
        return meetDependencies(slot.upgrades, upgrade.deps) &&
          meetDependencies(player.exotic_upgrades[slot.element], upgrade.exotic_deps) &&
          meetDependencies(player.dark_upgrades, upgrade.dark_deps);
      };

      function meetDependencies(upgrades, dependencies) {
        if(!dependencies){
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
