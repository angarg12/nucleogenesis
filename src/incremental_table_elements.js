angular
.module('incremental', [ 'ngAnimate' ])
.controller('IncCtrl',
['$scope',
'$document',
'$interval',
'$sce',
'$filter',
'$timeout',
function ($scope, $document, $interval, $sce, $filter, $timeout) {
  $scope.version = '1.0.2';
  $scope.Math = window.Math;
  var self = this;

  // Polyfill for some browsers
  Number.parseFloat = parseFloat;
  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  };

  // TODO: The startPlayer object can be mostly build
  // by using the data.js structures. That would save
  // a lot of
  // redundancy and make the code more flexible and
  // dynamic.
  this.startPlayer = {
    // properties just for the sake of the intro
    // animation
    intro : {
      banner : false,
      menu : false,
      content : false
    },
    elements_unlocked : 1,
    current_theme : "base",
    version : $scope.version
  };

  $scope.current_tab = "Elements";
  $scope.current_entry = "Hydrogen";
  $scope.current_element = "H";
  $scope.hover_element = "";
  $scope.synthesis_price_increase = 1.15;
  $scope.synthesis_power_increase = 2;
  $scope.toast = [];
  $scope.is_toast_visible = false;

  self.numberGenerator = new Ziggurat();

  self.populatePlayer = function () {
    this.startPlayer.resources = {};
    for(var entry in $scope.resources) {
      this.startPlayer.resources[entry] = {
        number : 0,
        is_new : true,
        unlocked : false
      };
    }

    this.startPlayer.elements = {};
    for(var element in $scope.elements) {
      if(!$scope.elements[element].disabled) {
        this.startPlayer.elements[element] = {
          unlocked : false
        };
      }
    }
    this.startPlayer.elements.H.unlocked = true;

    for(var element in this.startPlayer.elements) {
      this.startPlayer.elements[element].upgrades = {};
      for(var upgrade in $scope.upgrades) {
        this.startPlayer.elements[element].upgrades[upgrade] = {
          bought : false
        };
      }
      this.startPlayer.elements[element].generators = {};
      for(var generator in $scope.generators) {
        this.startPlayer.elements[element].generators[generator] = {
          level : 0
        };
      }
    }
    this.startPlayer.encyclopedia = {};
    for(var entry in $scope.encyclopedia) {
      this.startPlayer.encyclopedia[entry] = {
        is_new : true
      };
    }
    this.startPlayer.unlocks = {};
    for(var entry in $scope.unlocks) {
      this.startPlayer.unlocks[entry] = false;
    }
    this.startPlayer.synthesis = {};
    for(var entry in $scope.synthesis) {
      this.startPlayer.synthesis[entry] = {
        number : 0,
        active : 0,
        is_new : true
      };
    }

    this.startPlayer.resources.H.number = $scope.generators["Tier 1"].price;
  };

  $scope.removeToast = function () {
    $scope.is_toast_visible = false;
    $timeout(self.deleteToast, 1100);
  };

  self.deleteToast = function () {
    $scope.toast.shift();
    if($scope.toast.length > 0) {
      $scope.is_toast_visible = true;
    }
  };

  $scope.addToast = function (toast) {
    $scope.toast.push(toast);
    if($scope.toast.length == 1) {
      $scope.is_toast_visible = true;
    }
  };

  self.checkUnlock = $scope.$on("resource", function (event, item) {
    $scope.player.resources[item].unlocked = true;
  });

  $scope.elementPrice = function (element) {
    return Math.pow($scope.player.elements_unlocked + 1, $scope.elements[element].order);
  };

  $scope.isElementCostMet = function (element) {
    var price = $scope.elementPrice(element);
    return $scope.player.resources['e-'].number >= price &&
           $scope.player.resources.p.number >= price &&
           $scope.player.resources.n.number >= price;
  };

  $scope.generatorPrice = function (name, element) {
    var level = $scope.player.elements[element].generators[name].level;
    var price = $scope.generators[name].price * Math.pow($scope.generators[name].priceIncrease, level);
    return Math.ceil(price);
  };

  $scope.synthesisMultiplier = function (synthesis) {
    var level = $scope.player.synthesis[synthesis].number;
    return Math.ceil(Math.pow($scope.synthesis_price_increase, level));
  };

  $scope.synthesisPower = function (synthesis) {
    var level = $scope.player.synthesis[synthesis].active;
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
      if($scope.player.resources[resource].number < price[resource]) {
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
        $scope.player.resources[resource].number -= price[resource];
      }
      $scope.player.synthesis[synthesis].number += 1;
      i++;
    }
  };

  $scope.getHTML = function (resource) {
    var html = $scope.html[resource];
    if(html === undefined){
      html = $scope.resources[resource].html;
    }
    if(html === undefined){
      return resource;
    }
    return html;
  };

  $scope.buyGenerators = function (name, element, number) {
    var price = $scope.generatorPrice(name, element);
    var i = 0;
    // we need a loop since we use the ceil operator
    while (i < number && $scope.player.resources[element].number >= price) {
      $scope.player.resources[element].number -= price;
      $scope.player.elements[element].generators[name].level++;
      price = $scope.generatorPrice(name, element);
      i++;
    }
    if(i > 0) {
      $scope.$emit("generator", name);
    }
  };

  $scope.buyUpgrade = function (name, element) {
    if($scope.player.elements[element].upgrades[name].bought) {
      return;
    }
    var price = $scope.upgrades[name].price;
    if($scope.player.resources[element].number >= price) {
      $scope.player.resources[element].number -= price;
      $scope.player.elements[element].upgrades[name].bought = true;
    }
  };

  $scope.buyElement = function (element) {
    if($scope.player.elements[element].unlocked) {
      return;
    }
    if($scope.isElementCostMet(element)) {
      var price = $scope.elementPrice(element);
      $scope.player.resources['e-'].number -= price;
      $scope.player.resources.p.number -= price;
      $scope.player.resources.n.number -= price;
      $scope.$emit("element", element);
      $scope.player.elements[element].unlocked = true;
      $scope.player.elements[element].generators["Tier 1"].level = 1;
      $scope.player.elements_unlocked++;
    }
  };

  $scope.isReactionCostMet = function (number, reaction) {
    var keys = Object.keys(reaction.reactant);
    for(var i = 0; i < keys.length; i++) {
      var available = $scope.player.resources[keys[i]].number;
      var required = Number.parseFloat((number * reaction.reactant[keys[i]]).toFixed(4));
      if(required > available) {
        return false;
      }
    }
    return true;
  };

  $scope.lastUpgradeTierPrice = function (tier) {
    for(var upgrade in $scope.generators[tier].upgrades) {
      if(!$scope.player.elements[$scope.current_element].upgrades[$scope.generators[tier].upgrades[upgrade]].bought) {
        return $scope.upgrades[$scope.generators[tier].upgrades[upgrade]].price;
      }
    }
    return null;
  };

  $scope.filterUpgrade = function (input) {
    return $scope.player.elements[$scope.current_element].generators[input].level > 0;
  };

  $scope.react = function (number, reaction) {
    if(!Number.isInteger(number) || number <= 0) {
      return;
    }
    if($scope.isReactionCostMet(number, reaction)) {
      var reactant = Object.keys(reaction.reactant);
      for(var i = 0; i < reactant.length; i++) {
        var required = Number.parseFloat((number * reaction.reactant[reactant[i]]).toFixed(4));
        $scope.player.resources[reactant[i]].number -= required;
        $scope.player.resources[reactant[i]].number = Number.parseFloat($scope.player.resources[reactant[i]].number
            .toFixed(4));
      }
      var product = Object.keys(reaction.product);
      for(var i = 0; i < product.length; i++) {
        var produced = number * reaction.product[product[i]];
        var current = $scope.player.resources[product[i]].number;
        $scope.player.resources[product[i]].number = Number.parseFloat((current + produced).toFixed(4));
        $scope.$emit("resource", product[i]);
      }
    }
  };

  $scope.generatorProduction = function (name, element) {
    var baseProduction = $scope.generators[name].power;
    var upgradedProduction = baseProduction;
    for(var upgrade in $scope.generators[name].upgrades) {
      if($scope.player.elements[element].upgrades[$scope.generators[name].upgrades[upgrade]].bought) {
        upgradedProduction = $scope.upgrades[$scope.generators[name].upgrades[upgrade]]
            .apply(upgradedProduction);
      }
    }
    return upgradedProduction;
  };

  $scope.tierProduction = function (name, element) {
    var baseProduction = $scope.generators[name].power *
                         $scope.player.elements[element].generators[name].level;
    var upgradedProduction = baseProduction;
    for(var upgrade in $scope.generators[name].upgrades) {
      if($scope.player.elements[element].upgrades[$scope.generators[name].upgrades[upgrade]].bought) {
        upgradedProduction = $scope.upgrades[$scope.generators[name].upgrades[upgrade]]
            .apply(upgradedProduction);
      }
    }
    return upgradedProduction;
  };

  $scope.elementProduction = function (element) {
    var total = 0;
    for(var tier in $scope.generators) {
      total += $scope.tierProduction(tier, element);
    }
    return total;
  };

  $scope.updateCurrent = function (variable, new_value) {
    $scope[variable] = new_value;
  };

  $scope.save = function () {
    localStorage.setItem("playerStoredITE", JSON.stringify($scope.player));
    var d = new Date();
    $scope.lastSave = d.toLocaleTimeString();
  };

  $scope.load = function () {
    try {
      $scope.player = JSON.parse(localStorage.getItem("playerStoredITE"));
    } catch (err) {
      alert("Error loading savegame, reset forced.");
      $scope.reset(false);
    }
    self.versionControl();
  };

  $scope.reset = function (ask) {
    var confirmation = true;
    if(ask) {
      confirmation = confirm("Are you sure you want to reset? This will permanently erase your progress.");
    }

    if(confirmation === true) {
      localStorage.removeItem("playerStoredITE");
      self.init();
      self.introAnimation();
    }
  };

  $scope.exportSave = function () {
    var exportText = btoa(JSON.stringify($scope.player));

    $("#exportSaveContents").toggle();
    $("#exportSaveText").val(exportText);
    $("#exportSaveText").select();
  };

  $scope.importSave = function () {
    var importText = prompt("Paste the text you were given by the export save dialog here.\n" + 
        "Warning: this will erase your current save!");
    if(importText) {
      try {
        $scope.player = JSON.parse(atob(importText));
        self.stopListeners();
        self.versionControl();
        $scope.save();
        self.initializeListeners();
      } catch (error) {
        alert("Invalid save file.");
      }
    }
  };

  self.versionControl = function () {
    /*
     * if(versionCompare($scope.player.version,"0.11") == -1){
     * init(); }
     */
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

  self.update = function () {
    // decay should become first, since we are decaying the products from last step
    // We will process the radioactive decay
    for(var i = 0; i < $scope.radioisotopes.length; i++) {
      var radioisotope = $scope.radioisotopes[i];
      if($scope.player.resources[radioisotope].unlocked) {
        var number = $scope.player.resources[radioisotope].number;

        var half_life = $scope.resources[radioisotope].decay.half_life;

        var production = self.randomDraw(number, Math.log(2) / half_life);
        // we decrease the number of radioactive
        // element
        $scope.player.resources[radioisotope].number -= production;
        // and decay products
        for(var product in $scope.resources[radioisotope].decay.decay_product) {
          if(production > 0) {
            $scope.player.resources[product].number += $scope.resources[radioisotope].decay.decay_product[product] *
                                                       production;
            $scope.$emit("resource", product);
            $scope.$emit("decay", $scope.resources[radioisotope].decay.decay_type);
          }
        }
      }
    }

    // decomposition comes second since it is very similar to radioactivity
    // We will process the decompositions
    for(var i = 0; i < $scope.unstables.length; i++) {
      var unstable = $scope.unstables[i];
      if($scope.player.resources[unstable].unlocked) {
        var number = $scope.player.resources[unstable].number;
        var half_life = $scope.resources[unstable].decay.half_life;
        production = self.randomDraw(number, Math.log(2) / half_life);
        
        // we decrease the number of unstable element
        $scope.player.resources[unstable].number -= production;
        // produce decay products
        for(var product in $scope.resources[unstable].decay.decay_product) {
          if(production > 0) {
            $scope.player.resources[product].number += $scope.resources[unstable].decay.decay_product[product] *
                                                       production;
            $scope.$emit("resource", product);
          }
        }
      }
    }

    // We will simulate the reactivity of free radicals
    for(var i = 0; i < $scope.free_radicals.length; i++) {
      var radical = $scope.free_radicals[i];
      if($scope.player.resources[radical].unlocked) {
        production = self.randomDraw($scope.player.resources[radical].number, 
            $scope.resources[radical].free_radical.reactivity);

        var reacted = {};
        var remaining_production = production;
        for(var j = 0; j < $scope.resources[radical].free_radical.reaction.length - 1; j++) {
          var reaction = $scope.resources[radical].free_radical.reaction[j];
          var product = reaction.product;
          var reactants_number = 0;
          // we have to calculate how many reactants are there so that we get the proportions right
          for(var k = j; k < $scope.resources[radical].free_radical.reaction.length; k++) {
            var reactant = $scope.resources[radical].free_radical.reaction[k].reactant;
            var chance = $scope.resources[radical].free_radical.reaction[k].chance;
            reactants_number += $scope.player.resources[reactant].number * chance;
          }

          var p = $scope.player.resources[reaction.reactant].number / reactants_number;
          reacted[product] = self.randomDraw(remaining_production, p);

          remaining_production -= reacted[product];
          // This is complicated... when an element reacts with itself, we are not producing the
          // full amount, but half of it e.g. if you react 30 atoms with itself, they will form 15 pairs
          // also if the production number is even, there will be one leftover atom, that must be put back into
          // the pool
          // finally to avoid double counting, we need to refill the atoms by half of the production
          if(reaction.reactant == radical) {
            var adjusted_production = Math.floor(reacted[product] / 2);
            $scope.player.resources[radical].number += reacted[product] % 2 + adjusted_production;
            reacted[product] = adjusted_production;
          }
        }
        // The last reaction is just the remaining production that hasn't been consumed
        reacted[$scope.resources[radical].free_radical.reaction[$scope.resources[radical].free_radical.reaction.length - 1].product] = remaining_production;

        for(var reaction in $scope.resources[radical].free_radical.reaction) {
          var reactant = $scope.resources[radical].free_radical.reaction[reaction].reactant;
          product = $scope.resources[radical].free_radical.reaction[reaction].product;
          $scope.player.resources[reactant].number -= reacted[product];
          $scope.player.resources[product].number += reacted[product];
          if($scope.player.resources[product].number > 0) {
            $scope.$emit("resource", product);
          }
        }
        $scope.player.resources[radical].number -= production;
      }
    }

    // We will simulate the production of isotopes proportional to their ratio
    for(var element in $scope.player.elements) {
      if($scope.player.elements[element].unlocked === false){
        continue;
      }
      // Prepare an array with the isotopes
      var isotopes = [ element ];
      isotopes = isotopes.concat($scope.elements[element].isotopes);
      var remaining = $scope.elementProduction(element);
      // We will create a random draw recalculate the mean and std
      for(var i = 0; i < isotopes.length - 1; i++) {
        // First we need to adjust the ratio for the remaining isotopes
        var remaining_ratio_sum = 0;
        for(var j = i; j < isotopes.length; j++) {
          remaining_ratio_sum += $scope.resources[isotopes[j]].ratio;
        }

        var p = $scope.resources[isotopes[i]].ratio / remaining_ratio_sum;
        production = self.randomDraw(remaining, p);

        if(production > 0) {
          $scope.player.resources[isotopes[i]].number += production;
          $scope.$emit("resource", isotopes[i]);
        }
        remaining -= production;
      }
      // The last isotope is just the remaining production that hasn't been consumed
      if(remaining > 0) {
        $scope.player.resources[isotopes[isotopes.length - 1]].number += remaining;
        $scope.$emit("resource", isotopes[isotopes.length - 1]);
      }
    }

    // We will process the synthesis reactions
    for(var synthesis in $scope.player.synthesis) {
      var power = $scope.synthesisPower(synthesis);
      if(power !== 0) {
        $scope.react(power, $scope.synthesis[synthesis]);
      }
    }
  };

  /*
   * Formats a reaction i.e. a transformation from one compound to
   * another
   */
  $scope.reactionFormat = function (number, reaction) {
    var reactionHTML = "";
    reactionHTML += $scope.compoundFormat(number, reaction.reactant);
    reactionHTML += " <span class=\"icon\">&#8594;</span> ";
    reactionHTML += $scope.compoundFormat(number, reaction.product);
    return reactionHTML;
  };

  /*
   * Formats in HTML a compound i.e. a collection of resources of
   * the form x + y + z
   */
  $scope.compoundFormat = function (number, compound) {
    var compoundHTML = "";
    var keys = Object.keys(compound);
    for(var i = 0; i < keys.length; i++) {
      if(Number.isInteger(number) && number > 1) {
        compoundHTML += $scope.prettifyNumber(Number.parseFloat((number * compound[keys[i]]).toFixed(4))) +
                        " ";
      } else if(compound[keys[i]] != 1) {
        compoundHTML += $scope.prettifyNumber(compound[keys[i]]) + " ";
      }
      compoundHTML += $scope.getHTML(keys[i]) + " ";
      if(i < keys.length - 1) {
        compoundHTML += "+ ";
      }
    }
    return compoundHTML.trim();
  };

  $scope.decayFormat = function (decay) {
    var format = '<span class="icon">&#8594;</span>';
    format += $scope.compoundFormat(1, decay.decay_product);
    return format;
  };

  $scope.exchangeReaction = function (reaction) {
    var temp = reaction.reactant;
    reaction.reactant = reaction.product;
    reaction.product = temp;
  };

  $scope.prettifyNumber = function (number) {
    if(typeof number == 'undefined') {
      return;
    }
    if(number === "") {
      return "";
    }
    if(number == Infinity) {
      return "&infin;";
    }
    if(number > 1e6) {
      // Very ugly way to extract the mantisa and exponent from an exponential string
      var exponential = number.toPrecision(6).split("e");
      var exponent = parseFloat(exponential[1].split("+")[1]);
      // And it is displayed in with superscript
      return $filter('number')(exponential[0]) +
             " &#215; 10<sup>" +
             $scope.prettifyNumber(exponent) +
             "</sup>";
    }
    return $filter('number')(number);
  };

  self.init = function () {
    $scope.current_tab = "Elements";
    $scope.current_entry = "Hydrogen";
    $scope.current_element = "H";
    $scope.hover_element = "";
    $scope.toast = [];
    $scope.is_toast_visible = false;
    self.populatePlayer();
    $scope.player = angular.copy(this.startPlayer);
  };

  self.initializeListeners = function () {
    for(var key in $scope.unlocks) {
      if(!$scope.player.unlocks[key]) {
        $scope.unlocks[key].listener = $scope.$on($scope.unlocks[key].event, $scope.unlocks[key].check);
      }
    }
  };

  self.stopListeners = function () {
    for(var key in $scope.unlocks) {
      if($scope.unlocks[key].listener) {
        $scope.unlocks[key].listener();
        $scope.unlocks[key].listener = undefined;
      }
    }
  };

  self.checkUnlocks = function () {
    $scope.$emit("cycle", null);
  };

  $scope.trustHTML = function (html) {
    return $sce.trustAsHtml(html);
  };

  $scope.numberUnlocks = function () {
    return Object.keys($scope.unlocks).length;
  };

  $scope.numberUnlocked = function () {
    var unlocked = 0;
    for(var key in $scope.player.unlocks) {
      if($scope.player.unlocks[key]) {
        unlocked++;
      }
    }
    return unlocked;
  };

  $scope.visibleKeys = function (map) {
    var result = {};
    for(var key in map) {
      if(map[key].visible()) {
        result[key] = map[key];
      }
    }
    return Object.keys(result);
  };

  self.introAnimation = function () {
    $timeout(function () {
      self.introStep("banner");
    }, 3000);
    $timeout(function () {
      self.introStep("menu");
    }, 6000);
    $timeout(function () {
      self.introStep("content");
    }, 9000);
  };

  self.introStep = function (value) {
    $scope.player.intro[value] = true;
  };

  self.logn = function(number, base){
    return Math.log(number)/Math.log(base);
  };
  
  /**
   * Simply compares two string version values.
   * 
   * Example: versionCompare('1.1', '1.2') => smaller
   * versionCompare('1.1', '1.1') => equal versionCompare('1.2',
   * '1.1') => bigger versionCompare('2.23.3', '2.22.3') => bigger
   * 
   * Returns: smaller = left is LOWER than right equal = they are
   * equal bigger = left is GREATER = right is LOWER And FALSE if
   * one of input versions are not valid
   * 
   * @function
   * @param {String}
   *          left Version #1
   * @param {String}
   *          right Version #2
   * @return {Integer|Boolean}
   * @author Alexey Bass (albass)
   * @since 2011-07-14
   */
  self.versionCompare = function (left, right) {
    if(typeof left != 'string' || typeof right != 'string') {
      return;
    }

    var a = left.split('.');
    var b = right.split('.');
    var len = Math.max(a.length, b.length);

    for(var i = 0; i < len; i++) {
      if((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
        return 'bigger';
      } else if((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
        return 'smaller';
      }
    }

    return 'equal';
  };

  self.onload = $timeout(function () {
    loadData($scope);
    if(localStorage.getItem("playerStoredITE") !== null) {
      $scope.load();
    }
    if($scope.player === undefined) {
      self.init();
    }
    if($scope.lastSave === undefined) {
      $scope.lastSave = "None";
    }
    // init();
    self.introAnimation();
    self.initializeListeners();
    $interval(self.update, 1000);
    $interval(self.checkUnlocks, 1000);
    $interval($scope.save, 10000);
  });
} ]);
