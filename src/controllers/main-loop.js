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
  $scope.Math = window.Math;

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

  // since load calls are asynchronous, we need to do this to make sure that the data
  // is loaded before the services
  data.loadData().then(function() {
	  player.populatePlayer();

	  self.onload = $timeout(self.startup);
  });

  self.processDecay = function (resources) {
    for(var i = 0; i < resources.length; i++) {
      var resource = resources[i];
      if(player.data.resources[resource].unlocked) {
        var number = player.data.resources[resource].number;
        var half_life = data.resources[resource].decay.half_life;
        var production = util.randomDraw(number, Math.log(2) / half_life);

        if(production === 0) {
          return;
        }

        // we decrease the number of radioactive element
        player.data.resources[resource].number -= production;

        // and decay products
        for(var product in data.resources[resource].decay.decay_product) {
          player.data.resources[product].number += data.resources[resource].decay.decay_product[product] *
                                                     production;
          player.data.resources[product].unlocked = true;
          $scope.$emit("unlocks", product);
          var decay_type = data.resources[resource].decay.decay_type;
          if(decay_type){
            $scope.$emit("unlocks", decay_type);
          }
        }
      }
    }
  };

  self.processIsotopes = function () {
    // We will simulate the production of isotopes proportional to their ratio
    for(var element in player.data.elements) {
      if(player.data.elements[element].unlocked === false){
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
          player.data.resources[isotopes[i]].number += production;
          player.data.resources[isotopes[i]].unlocked = true;
          $scope.$emit("unlocks", isotopes[i]);
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        player.data.resources[isotopes[isotopes.length - 1]].number += remaining;
        player.data.resources[isotopes[isotopes.length - 1]].unlocked = true;
        $scope.$emit("unlocks", isotopes[isotopes.length - 1]);
      }
    }
  };

  self.update = function () {
    self.processDecay(data.radioisotopes);
    self.processIsotopes();
    synthesis.processSynthesis();

    $scope.$emit("unlocks", null);
  };

  self.checkUnlock = $scope.$on("unlocks", function (event, token) {
    for(var unlock in self.data.unlocks){
      if(!self.player.data.unlocks[unlock]){
        item = self.data.unlocks[unlock];

        if(eval(item.condition)){
          self.achievement.addToast(item.name);
          self.player.data.unlocks[unlock] = true;
        }
      }
    }
  });

  self.startup = function () {
    if(localStorage.getItem("playerStoredITE") !== null) {
      savegame.load();
    }
    if(player.data === undefined) {
      state.init();
    }
    // init();
    achievement.init();
    $interval(self.update, 1000);
    $interval(savegame.save, 10000);
  };
}]);
