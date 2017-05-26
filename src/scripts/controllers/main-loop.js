'use strict';

angular
  .module('game')
  .controller('main-loop', ['$scope',
    '$interval',
    '$timeout',
    'achievement',
    'util',
    'savegame',
    'generator',
    'format',
    'synthesis',
    'reaction',
    'data',
    'visibility',
    'state',
    function($scope, $interval, $timeout, achievement, util, savegame, generator, format, synthesis, reaction, data, visibility, state) {
      $scope.data = data;
      $scope.achievement = achievement;
      $scope.util = util;
      $scope.savegame = savegame;
      $scope.generator = generator;
      $scope.format = format;
      $scope.synthesis = synthesis;
      $scope.reaction = reaction;
      $scope.visibility = visibility;
      $scope.state = state;
      $scope.loading = true;

      let self = this;
      let playerCopy = null;

      function processDecay() {
        for (let i = 0; i < data.radioisotopes.length; i++) {
          let resource = data.radioisotopes[i];
          if (playerCopy.resources[resource].unlocked) {
            let number = playerCopy.resources[resource].number;
            let halfLife = data.resources[resource].decay.half_life;
            let production = util.randomDraw(number, Math.log(2) / halfLife);

            if (production === 0) {
              return;
            }

            // we decrease the number of radioactive element
            playerCopy.resources[resource].number -= production;

            // and decay products
            for (let product in data.resources[resource].decay.decay_product) {
              playerCopy.resources[product].number += data.resources[resource].decay.decay_product[product] *
                production;
              if (!playerCopy.resources[product].unlocked) {
                playerCopy.resources[product].unlocked = true;
                visibility.addNew(product);
              }
            }
          }
        }
      }

      function processGenerators() {
        // We will simulate the production of isotopes proportional to their ratio
        for (let element in playerCopy.elements) {
          if (playerCopy.elements[element].unlocked === false) {
            continue;
          }
          // Prepare an array with the isotopes
          let isotopes = Object.keys(data.elements[element].isotopes);
          let remaining = generator.elementProduction(element);
          // We will create a random draw recalculate the mean and std
          for (let i = 0; i < isotopes.length - 1; i++) {
            // First we need to adjust the ratio for the remaining isotopes
            let remainingRatioSum = 0;
            for (let j = i; j < isotopes.length; j++) {
              remainingRatioSum += data.resources[isotopes[j]].ratio;
            }

            let p = data.resources[isotopes[i]].ratio / remainingRatioSum;
            let production = util.randomDraw(remaining, p);

            if (production > 0) {
              playerCopy.resources[isotopes[i]].number += production;
              if (!playerCopy.resources[isotopes[i]].unlocked) {
                playerCopy.resources[isotopes[i]].unlocked = true;
                visibility.addNew(isotopes[i]);
              }
            }
            remaining -= production;
          }
          // The last isotope is just the remaining production that hasn't been consumed
          if (remaining > 0) {
            let last = isotopes[isotopes.length - 1];
            playerCopy.resources[last].number += remaining;
            if (!playerCopy.resources[last].unlocked) {
              playerCopy.resources[last].unlocked = true;
              visibility.addNew(last);
            }
          }
        }
      }

      function processSyntheses() {
        // We will process the synthesis
        for (let syn in playerCopy.syntheses) {
          let power = synthesis.synthesisPower(syn);
          if (power !== 0) {
            reaction.react(power, data.syntheses[syn], playerCopy);
          }
        }
      }

      self.update = function() {
        // do the update in a copy
        playerCopy = angular.copy(state.player);
        processDecay();
        processGenerators();
        processSyntheses();
        achievement.checkAchievements(playerCopy);

        // and update all at once
        state.player = playerCopy;

        $timeout(self.update, 1);
      };

      self.startup = function() {
        savegame.load();
        $scope.loading = false;
        $timeout(self.update, 1);
        $interval(savegame.save, 10000);
      };

      $timeout(self.startup);
    }
  ]);
