angular
.module('incremental')
.controller('IncCtrl',
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
'animation',
'format',
'synthesis',
'reaction',
'element',
'data',
function ($scope, $document, $interval, $sce, $filter, $timeout, achievement, util, player, savegame, generator, upgrade, animation, format, synthesis, reaction, element, data) {
  $scope.version = '1.0.2';
  $scope.Math = window.Math;
  
  $scope.data = data;
  $scope.player = player;
  $scope.achievement = achievement;
  $scope.util = util;
  $scope.savegame = savegame;
  $scope.generator = generator;
  $scope.upgrade = upgrade;
  $scope.animation = animation;
  $scope.format = format;
  $scope.synthesis = synthesis;
  $scope.reaction = reaction;
  $scope.element = element;
  var self = this;
  
  $scope.current_tab = "Elements";
  // FIXME these keys couple the controller to the data in non-obvious ways
  // e.g. if the keys change, the controller breaks. to fix, point them to the first element
  $scope.current_entry = "hydrogen";
  $scope.current_element = "H";
  $scope.hover_element = "";
  
  // since load calls are asynchronous, we need to do this to make sure that the data
  // is loaded before the services
  data.setScope($scope);
  data.loadData().then(function() {
	  player.setScope($scope);
	  achievement.setScope($scope);
	  util.setScope($scope);
	  savegame.setScope($scope);
	  generator.setScope($scope);
	  upgrade.setScope($scope);
	  animation.setScope($scope);
	  format.setScope($scope);
	  synthesis.setScope($scope);
	  reaction.setScope($scope);
	  element.setScope($scope);
	  
	  self.onload = $timeout(self.startup);
  });
  
  self.processDecay = function (resources) {
    for(var i = 0; i < resources.length; i++) {
      var resource = resources[i];
      if(player.data.resources[resource].unlocked) {
        var number = player.data.resources[resource].number;
        var half_life = $scope.resources[resource].decay.half_life;
        var production = util.randomDraw(number, Math.log(2) / half_life);
        
        if(production === 0) {
          return;
        }
        
        // we decrease the number of radioactive element
        player.data.resources[resource].number -= production;
        
        // and decay products
        for(var product in $scope.resources[resource].decay.decay_product) {
          player.data.resources[product].number += $scope.resources[resource].decay.decay_product[product] *
                                                     production;
          $scope.$emit("unlocks", product);
          var decay_type = $scope.resources[resource].decay.decay_type;
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
      var isotopes = [ element ];
      isotopes = isotopes.concat($scope.elements[element].isotopes);
      var remaining = generator.elementProduction(element);
      // We will create a random draw recalculate the mean and std
      for(var i = 0; i < isotopes.length - 1; i++) {
        // First we need to adjust the ratio for the remaining isotopes
        var remaining_ratio_sum = 0;
        for(var j = i; j < isotopes.length; j++) {
          remaining_ratio_sum += $scope.resources[isotopes[j]].ratio;
        }

        var p = $scope.resources[isotopes[i]].ratio / remaining_ratio_sum;
        var production = util.randomDraw(remaining, p);

        if(production > 0) {
          player.data.resources[isotopes[i]].number += production;
          $scope.$emit("unlocks", isotopes[i]);
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        player.data.resources[isotopes[isotopes.length - 1]].number += remaining;
        $scope.$emit("unlocks", isotopes[isotopes.length - 1]);
      }
    }
  };
  
  self.update = function () {
    self.processDecay($scope.radioisotopes);
    self.processIsotopes();
    synthesis.processSynthesis();

    $scope.$emit("unlocks", null);
  };

  $scope.init = function () {
    $scope.current_tab = "Elements";
    $scope.current_entry = "hydrogen";
    $scope.current_element = "H";
    $scope.hover_element = "";
    player.populatePlayer();
    achievement.init();
    animation.introAnimation();
  };
  
  self.checkUnlock = $scope.$on("unlocks", function (event, item) {

  });
  
  self.startup = function () {
    $scope.current_encyclopedia_url = $sce.trustAsResourceUrl($scope.encyclopedia[$scope.current_entry].link);
    if(localStorage.getItem("playerStoredITE") !== null) {
      savegame.load();
    }
    if(player.data === undefined) {
      $scope.init();
    }
    if($scope.lastSave === undefined) {
      $scope.lastSave = "None";
    }
    // init();
    achievement.init();
    animation.introAnimation();
    $interval(self.update, 1000);
    $interval(savegame.save, 10000);
  };
}]);
