'use strict';

angular
.module('incremental')
.controller('main-loop',
['$scope',
'$document',
'$interval',
'$sce',
'$filter',
'$timeout',
'achievement',
'util',
'player',
'savegame',
'generator',
'upgrade',
'format',
'synthesis',
'reaction',
'element',
'data',
'visibility',
'state',
function ($scope, $document, $interval, $sce, $filter, $timeout, achievement, util, player, savegame, generator, upgrade, format, synthesis, reaction, element, data, visibility, state) {
  $scope.data = data;
  $scope.player = player;
  $scope.achievement = achievement;
  $scope.util = util;
  $scope.savegame = savegame;
  $scope.generator = generator;
  $scope.upgrade = upgrade;
  $scope.format = format;
  $scope.synthesis = synthesis;
  $scope.reaction = reaction;
  $scope.visibility = visibility;
  $scope.element = element;
  $scope.state = state;
  $scope.loading = true;

  var self = this;
  let player_copy = null;
  // FIXME read this from npm
  $scope.version = '1.0.4';

  function processDecay () {
    for(var i = 0; i < data.radioisotopes.length; i++) {
      var resource = data.radioisotopes[i];
      if(player_copy.resources[resource].unlocked) {
        var number = player_copy.resources[resource].number;
        var half_life = data.resources[resource].decay.half_life;
        var production = util.randomDraw(number, Math.log(2) / half_life);

        if(production === 0) {
          return;
        }

        // we decrease the number of radioactive element
        player_copy.resources[resource].number -= production;

        // and decay products
        for(var product in data.resources[resource].decay.decay_product) {
          player_copy.resources[product].number += data.resources[resource].decay.decay_product[product] *
                                                     production;
          if(!player_copy.resources[product].unlocked){
            player_copy.resources[product].unlocked = true;
            visibility.addNew(product);
          }
        }
      }
    }
  }

  function processGenerators () {
    // We will simulate the production of isotopes proportional to their ratio
    for(var element in player_copy.elements) {
      if(player_copy.elements[element].unlocked === false){
        continue;
      }
      // Prepare an array with the isotopes
      var isotopes = Object.keys(data.elements[element].isotopes);
      var remaining = generator.elementProduction(element);
      // We will create a random draw recalculate the mean and std
      for(var i = 0; i < isotopes.length - 1; i++) {
        // First we need to adjust the ratio for the remaining isotopes
        var remaining_ratio_sum = 0;
        for(var j = i; j < isotopes.length; j++) {
          remaining_ratio_sum += data.resources[isotopes[j]].ratio;
        }

        var p = data.resources[isotopes[i]].ratio / remaining_ratio_sum;
        var production = util.randomDraw(remaining, p);

        if(production > 0) {
          player_copy.resources[isotopes[i]].number += production;
          if(!player_copy.resources[isotopes[i]].unlocked){
            player_copy.resources[isotopes[i]].unlocked = true;
            visibility.addNew(isotopes[i]);
          }
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        var last = isotopes[isotopes.length - 1];
        player_copy.resources[last].number += remaining;
        if(!player_copy.resources[last].unlocked){
          player_copy.resources[last].unlocked = true;
          visibility.addNew(last);
        }
      }
    }
  }

  function processSyntheses () {
    // We will process the synthesis
    for(var syn in player_copy.syntheses) {
      var power = synthesis.synthesisPower(syn);
      if(power !== 0) {
        reaction.react(power, data.syntheses[syn], player_copy);
      }
    }
  }

  self.update = function () {
    // do the update in a copy
    player_copy = angular.copy(player.data);
    processDecay();
    processGenerators();
    processSyntheses();
    achievement.checkAchievements(player_copy);

    // and update all at once
    player.data = player_copy;

    $timeout(self.update, 1);
  };

  self.startup = function () {
    savegame.load();
    $scope.loading = false;
    $timeout(self.update, 1);
    $interval(savegame.save, 10000);
  };

  $timeout(self.startup);
}]);
