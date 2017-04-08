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
  var self = this;
  // we need this just for the $on function
  self.data = data;
  self.player = player;
  self.achievement = achievement;
  self.player_copy = null;

  // since load calls are asynchronous, we need to do this to make sure that the data
  // is loaded before the services
  data.loadData().then(function() {
	  player.populatePlayer();

	  self.onload = $timeout(self.startup);
  });

  self.processDecay = function () {
    for(var i = 0; i < data.radioisotopes.length; i++) {
      var resource = data.radioisotopes[i];
      if(self.player_copy.resources[resource].unlocked) {
        var number = self.player_copy.resources[resource].number;
        var half_life = data.resources[resource].decay.half_life;
        var production = util.randomDraw(number, Math.log(2) / half_life);

        if(production === 0) {
          return;
        }

        // we decrease the number of radioactive element
        self.player_copy.resources[resource].number -= production;

        // and decay products
        for(var product in data.resources[resource].decay.decay_product) {
          self.player_copy.resources[product].number += data.resources[resource].decay.decay_product[product] *
                                                     production;
          self.player_copy.resources[product].unlocked = true;
        }
      }
    }
  };

  self.processGenerators = function () {
    // We will simulate the production of isotopes proportional to their ratio
    for(var element in self.player_copy.elements) {
      if(self.player_copy.elements[element].unlocked === false){
        continue;
      }
      // Prepare an array with the isotopes
      var isotopes = data.elements[element].isotopes;
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
          self.player_copy.resources[isotopes[i]].number += production;
          self.player_copy.resources[isotopes[i]].unlocked = true;
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        self.player_copy.resources[isotopes[isotopes.length - 1]].number += remaining;
        self.player_copy.resources[isotopes[isotopes.length - 1]].unlocked = true;
      }
    }
  };

  self.checkUnlocks = function () {
    for(var unlock in self.data.unlocks){
      if(!self.player_copy.unlocks[unlock]){
        item = self.data.unlocks[unlock];

        if(eval(item.condition)){
          self.achievement.addToast(item.name);
          self.player_copy.unlocks[unlock] = true;
        }
      }
    }
  };

  this.processSyntheses = function () {
    // We will process the synthesis
    for(var syn in self.player_copy.syntheses) {
      var power = synthesis.synthesisPower(syn);
      if(power !== 0) {
        reaction.react(power, data.syntheses[syn], self.player_copy);
      }
    }
  };

  self.update = function () {
    // do the update in a copy
    self.player_copy = angular.copy(player.data);
    self.processDecay();
    self.processGenerators();
    self.processSyntheses();
    self.checkUnlocks();

    // and update all at once
    player.data = self.player_copy;

    $timeout(self.update, 1);
  };

  self.startup = function () {
    if(localStorage.getItem("playerStoredITE") !== null) {
      savegame.load();
    }
    if(player.data === undefined) {
      state.init();
    }
    // init();
    achievement.init();
    $timeout(self.update, 1);
    $interval(savegame.save, 10000);
  };
}]);
