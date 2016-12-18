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
function ($scope, $document, $interval, $sce, $filter, $timeout, achievement, util, player, savegame, generator, upgrade, animation, format) {
  $scope.version = '1.0.2';
  $scope.Math = window.Math;
  $scope.player = player;
  $scope.achievement = achievement;
  $scope.util = util;
  $scope.savegame = savegame;
  $scope.generator = generator;
  $scope.upgrade = upgrade;
  $scope.animation = animation;
  $scope.format = format;
  var self = this;

  player.setScope($scope);
  achievement.setScope($scope);
  util.setScope($scope);
  savegame.setScope($scope);
  generator.setScope($scope);
  upgrade.setScope($scope);
  animation.setScope($scope);
  format.setScope($scope);
  
  $scope.current_tab = "Elements";
  $scope.current_entry = "Hydrogen";
  $scope.current_element = "H";
  $scope.hover_element = "";
  $scope.synthesis_price_increase = 1.15;
  $scope.synthesis_power_increase = 2;

  self.numberGenerator = new Ziggurat();

  $scope.elementPrice = function (element) {
    return Math.pow(player.data.elements_unlocked + 1, $scope.elements[element].order);
  };

  $scope.isElementCostMet = function (element) {
    var price = $scope.elementPrice(element);
    return player.data.resources['e-'].number >= price &&
           player.data.resources.p.number >= price &&
           player.data.resources.n.number >= price;
  };

  $scope.synthesisMultiplier = function (synthesis) {
    var level = player.data.synthesis[synthesis].number;
    return Math.ceil(Math.pow($scope.synthesis_price_increase, level));
  };

  $scope.synthesisPower = function (synthesis) {
    var level = player.data.synthesis[synthesis].active;
    return Math.ceil(Math.pow(level, $scope.synthesis_power_increase));
  };

  $scope.synthesisPrice = function (synthesis) {
    var multiplier = $scope.synthesisMultiplier(synthesis);
    var price = {};
    var reactant = $scope.synthesis[synthesis].reactant;
    for(var resource in reactant) {
      price[resource] = reactant[resource] * multiplier;
    }
    return price;
  };

  $scope.isSynthesisCostMet = function (synthesis) {
    var price = $scope.synthesisPrice(synthesis);
    for(var resource in price) {
      if(player.data.resources[resource].number < price[resource]) {
        return false;
      }
    }
    return true;
  };

  $scope.buySynthesis = function (synthesis, number) {
    var i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && $scope.isSynthesisCostMet(synthesis)) {
      var price = $scope.synthesisPrice(synthesis);
      for(var resource in price) {
        player.data.resources[resource].number -= price[resource];
      }
      player.data.synthesis[synthesis].number += 1;
      i++;
    }
  };

  $scope.buyElement = function (element) {
    if(player.data.elements[element].unlocked) {
      return;
    }
    if($scope.isElementCostMet(element)) {
      var price = $scope.elementPrice(element);
      player.data.resources['e-'].number -= price;
      player.data.resources.p.number -= price;
      player.data.resources.n.number -= price;
      $scope.$emit("element", element);
      player.data.elements[element].unlocked = true;
      player.data.elements[element].generators["Tier 1"].level = 1;
      player.data.elements_unlocked++;
    }
  };

  $scope.isReactionCostMet = function (number, reaction) {
    var keys = Object.keys(reaction.reactant);
    for(var i = 0; i < keys.length; i++) {
      var available = player.data.resources[keys[i]].number;
      var required = Number.parseFloat((number * reaction.reactant[keys[i]]).toFixed(4));
      if(required > available) {
        return false;
      }
    }
    return true;
  };

  $scope.react = function (number, reaction) {
    if(!Number.isInteger(number) || number <= 0) {
      return;
    }
    if($scope.isReactionCostMet(number, reaction)) {
      var reactant = Object.keys(reaction.reactant);
      for(var i = 0; i < reactant.length; i++) {
        var required = Number.parseFloat((number * reaction.reactant[reactant[i]]).toFixed(4));
        player.data.resources[reactant[i]].number -= required;
        player.data.resources[reactant[i]].number = Number.parseFloat(player.data.resources[reactant[i]].number
            .toFixed(4));
      }
      var product = Object.keys(reaction.product);
      for(var i = 0; i < product.length; i++) {
        var produced = number * reaction.product[product[i]];
        var current = player.data.resources[product[i]].number;
        player.data.resources[product[i]].number = Number.parseFloat((current + produced).toFixed(4));
        $scope.$emit("resource", product[i]);
      }
    }
  };

  self.randomDraw = function (number, p) {
    var mean = p * number;
    var production;
    if(mean < 5) {
      // using Poisson distribution (would get slow for large numbers. there are fast formulas but I don't know
      // how good they are)
      production = self.getPoisson(mean);
    } else {
      // Gaussian distribution
      var q = 1 - p;
      var variance = number * p * q;
      var std = Math.sqrt(variance);
      production = Math.round(self.numberGenerator.nextGaussian() * std + mean);
    }
    if(production > number) {
      production = number;
    }
    if(production < 0) {
      production = 0;
    }
    return production;
  };

  self.getPoisson = function (lambda) {
    var L = Math.exp(-lambda);
    var p = 1.0;
    var k = 0;

    do {
      k++;
      p *= Math.random();
    } while (p > L);

    return k - 1;
  };

  self.processDecay = function (resources) {
    for(var i = 0; i < resources.length; i++) {
      var resource = resources[i];
      if(player.data.resources[resource].unlocked) {
        var number = player.data.resources[resource].number;
        var half_life = $scope.resources[resource].decay.half_life;
        var production = self.randomDraw(number, Math.log(2) / half_life);
        
        if(production <= 0) {
          return;
        }
        
        // we decrease the number of radioactive element
        player.data.resources[resource].number -= production;
        
        // and decay products
        for(var product in $scope.resources[resource].decay.decay_product) {
          player.data.resources[product].number += $scope.resources[resource].decay.decay_product[product] *
                                                     production;
          $scope.$emit("resource", product);
          var decay_type = $scope.resources[resource].decay.decay_type;
          if(decay_type){
            $scope.$emit("decay", decay_type);
          }
        }
      }
    }
  };

  // We will simulate the reactivity of free radicals
  self.processUnstable = function () {
    for(var i = 0; i < $scope.free_radicals.length; i++) {
      var radical = $scope.free_radicals[i];
      if(player.data.resources[radical].unlocked) {
        var production = self.randomDraw(player.data.resources[radical].number, 
            $scope.resources[radical].free_radical.reactivity);
        
        var proportions = self.calculateProportions(radical);        
        var reacted = self.calculateReacted(radical, production, proportions);
        self.adjustResources(radical, production, reacted);
      }
    }
  };
  
  self.calculateProportions = function (radical) {
    var reactants_number = [];
    var reactants_total = 0;
    // we have to calculate how many reactants are there so that we get the proportions right
    for(var j = 0; j < $scope.resources[radical].free_radical.reaction.length; j++) {
      var reactant = $scope.resources[radical].free_radical.reaction[j].reactant;
      var chance = $scope.resources[radical].free_radical.reaction[j].chance;
      reactants_number[j] = Math.floor(player.data.resources[reactant].number * chance);
      reactants_total += reactants_number[j];
    }
    
    var proportions = [];
    for(var j = 0; j < reactants_number.length; j++) {
      proportions[j] = reactants_number[j]/reactants_total;
    }
    
    return proportions;
  };
  
  self.calculateReacted = function (radical, production, proportions) {
    var reacted = {};
    for(var j = 0; j < $scope.resources[radical].free_radical.reaction.length - 1; j++) {
      var reaction = $scope.resources[radical].free_radical.reaction[j];
      var reacted_number = self.randomDraw(production, proportions[j]);

      var product = reaction.product;
      reacted[product] = reacted_number;
      
      production -= reacted[product];
      // This is complicated... when an element reacts with itself, we are not producing the
      // full amount, but half of it e.g. if you react 30 atoms with itself, they will form 15 pairs
      // also if the production number is even, there will be one leftover atom, that must be put back into
      // the pool
      // finally to avoid double counting, we need to refill the atoms by half of the production
      if(reaction.reactant == radical) {
        var adjusted_production = Math.floor(reacted[product] / 2);
        player.data.resources[radical].number += reacted[product] % 2 + adjusted_production;
        reacted[product] = adjusted_production;
      }
    }
    // The last reaction is just the remaining production that hasn't been consumed
    reacted[$scope.resources[radical].free_radical.reaction[$scope.resources[radical].free_radical.reaction.length - 1].product] = production;

    return reacted;
  };
  
  self.adjustResources = function (radical, production, reacted){
    for(var reaction in $scope.resources[radical].free_radical.reaction) {
      var reactant = $scope.resources[radical].free_radical.reaction[reaction].reactant;
      var product = $scope.resources[radical].free_radical.reaction[reaction].product;
      player.data.resources[reactant].number -= reacted[product];
      player.data.resources[product].number += reacted[product];
      $scope.$emit("resource", product);
    }
    player.data.resources[radical].number -= production;
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
        var production = self.randomDraw(remaining, p);

        if(production > 0) {
          player.data.resources[isotopes[i]].number += production;
          $scope.$emit("resource", isotopes[i]);
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        player.data.resources[isotopes[isotopes.length - 1]].number += remaining;
        $scope.$emit("resource", isotopes[isotopes.length - 1]);
      }
    }
  };
  
  self.processSynthesis = function () {
    // We will process the synthesis reactions
    for(var synthesis in player.data.synthesis) {
      var power = $scope.synthesisPower(synthesis);
      if(power !== 0) {
        $scope.react(power, $scope.synthesis[synthesis]);
      }
    }
  };
  
  self.update = function () {
    // decay should become first, since we are decaying the products from last step
    self.processDecay($scope.radioisotopes);
    self.processUnstable();
    self.processIsotopes();
    self.processSynthesis();

    $scope.$emit("cycle", null);
  };

  $scope.init = function () {
    $scope.current_tab = "Elements";
    $scope.current_entry = "Hydrogen";
    $scope.current_element = "H";
    $scope.hover_element = "";
    achievement.init();
    player.populatePlayer();
    animation.introAnimation();
  };
  
  self.checkUnlock = $scope.$on("resource", function (event, item) {
    player.data.resources[item].unlocked = true;
  });
  
  self.onload = $timeout(function () {
    loadData($scope);
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
    achievement.initializeListeners();
    animation.introAnimation();
    $interval(self.update, 1000);
    $interval(savegame.save, 10000);
  });
}]);
