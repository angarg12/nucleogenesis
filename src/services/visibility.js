angular
.module('incremental')
.service('visibility',
['player',
 function(player) {  
  var $scope;
  
  this.setScope = function (scope){
    $scope = scope;
  };
  
  this.visibleElements = function() {
    elements = [];
    for( var element in $scope.elements) {
      if(isElementVisible(element)) {
        elements.push(element);
      }
    }
    return elements;
  };

  isElementVisible = function(element) {
    if($scope.elements[element].disabled) {
      return false;
    }
    return player.data.elements[element].unlocked;
  };

  this.visibleGenerators = function() {
    generators = [];
    for( var generator in $scope.generators) {
      if(isGeneratorVisible(generator)) {
        generators.push(generator);
      }
    }
    return generators;
  };

  isGeneratorVisible = function(name) {
    var generator = $scope.generators[name];
    var condition = "";
    for( var dep in generator.dependencies) {
      condition += "player.data.elements[$scope.current_element].generators['"
          + generator.dependencies[dep] + "'].level > 0" + " && ";
    }
    condition += "true";
    return eval(condition);
  };

  // FIXME use eval for the time being, refactor to preprocess conditional functions
  this.visibleUpgrade = function(name) {
    var upgrade = $scope.upgrades[name];
    var condition = "";
    for( var pre in upgrade.preconditions) {
      condition += upgrade.preconditions[pre] + " && ";
    }
    for( var dep in upgrade.dependencies) {
      condition += "player.data.elements[$scope.current_element].upgrades['"
          + upgrade.dependencies[dep] + "'].bought" + " && ";
    }
    condition += "true";

    return eval(condition);
  };  

  this.visibleResources = function() {
    resources = [];
    for( var resource in $scope.resources) {
      if(isResourceVisible(resource)) {
        resources.push(resource);
      }
    }
    return resources;
  };

  isResourceVisible = function(name) {
    if(!player.data.resources[name].unlocked){
      return false;
    }
    
    var elements = $scope.resources[name].elements;
    if(elements.length === 0){
      return true;
    }
    
    for(var element in elements){
      if($scope.current_element == elements[element]){
        return true;
      }
    }
    
    return false;
  };

  this.visibleEncyclopediaEntries = function() {
    entries = [];
    for( var entry in $scope.encyclopedia) {
      if(isEncyclopediaEntryVisible(entry)) {
        entries.push(entry);
      }
    }
    return entries;
  };

  isEncyclopediaEntryVisible = function(entry) {
    return player.data.unlocks[entry];
  };

  this.visibleRedox = function() {
    redox = [];
    for( var entry in $scope.redox) {
      if(isRedoxVisible($scope.redox[entry])) {
        redox.push(entry);
      }
    }
    return redox;
  };

  isRedoxVisible = function(entry) {
    if(!player.data.unlocks.redox){
      return false;
    }

    for(var reactant in entry.reactant){
      if(!player.data.resources[reactant].unlocked){
        return false;
      }
    }
    
    for(var element in entry.elements){
      if($scope.current_element === entry.elements[element]){
        return true;
      }
    }
    
    return false;
  };
  
  this.visibleBindings = function() {
    binding = [];
    for( var entry in $scope.binding_energy) {
      if(isBindingVisible($scope.binding_energy[entry])) {
        binding.push(entry);
      }
    }
    return binding;
  };

  isBindingVisible = function(entry) {
    if(!player.data.unlocks.nuclear_binding_energy){
      return false;
    }

    for(var reactant in entry.reactant){
      if(!player.data.resources[reactant].unlocked){
        return false;
      }
    }
    
    for(var element in entry.elements){
      if($scope.current_element === entry.elements[element]){
        return true;
      }
    }
    
    return false;
  };
  
  this.visibleSyntheses = function() {
    syntheses = [];
    for( var entry in $scope.syntheses) {
      if(isSynthesisVisible($scope.syntheses[entry])) {
        syntheses.push(entry);
      }
    }
    return syntheses;
  };

  isSynthesisVisible = function(entry) {
    if(!player.data.unlocks.synthesis){
      return false;
    }

    for(var reactant in entry.reactant){
      if(!player.data.resources[reactant].unlocked){
        return false;
      }
    }
    
    for(var element in entry.elements){
      if($scope.current_element === entry.elements[element]){
        return true;
      }
    }
    
    return false;
  };

  this.elementHasNew = function(element) {
    var includes = $scope.elements[element].includes;
    for( var key in includes) {
      if(player.data.resources[includes[key]].unlocked
          && player.data.resources[includes[key]].is_new) {
        return true;
      }
    }
    for( var index in $scope.elements[element].syntheses) {
      var synthesis = $scope.elements[element].syntheses[index];
      if(isSynthesisVisible(synthesis)
          && player.data.syntheses[synthesis].is_new) {
        return true;
      }
    }
    return false;
  };

  this.elementsHasNew = function() {
    for( var key in $scope.elements) {
      if(player.data.elements[key] !== undefined
          && player.data.elements[key].unlocked && this.elementHasNew(key)) {
        return true;
      }
    }
    for( var key in $scope.table_resources) {
      if(player.data.resources[$scope.table_resources[key]].unlocked
          && player.data.resources[$scope.table_resources[key]].is_new) {
        return true;
      }
    }
    return false;
  };

  this.encyclopediaHasNew = function() {
    for( var entry in player.data.encyclopedia) {
      if(isEncyclopediaEntryVisible(entry) && player.data.encyclopedia[entry].is_new) {
        return true;
      }
    }
  };
}]);