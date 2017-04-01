angular
.module('incremental')
.service('visibility',
['player',
'data',
'state',
 function(player, data, state) {
  visible = function(items, func) {
    var visibles = [];
    for(var item in items) {
      if(func(item)) {
        visibles.push(item);
      }
    }
    return visibles;
  };

  this.visibleElements = function() {
    return visible(data.elements, isElementVisible);
  };

  this.visibleGenerators = function() {
    return visible(data.generators, isGeneratorVisible);
  };

  this.visibleResources = function() {
    return visible(data.resources, isResourceVisible);
  };

  this.visibleEncyclopediaEntries = function() {
    return visible(data.encyclopedia, isEncyclopediaEntryVisible);
  };

  this.visibleRedox = function() {
    return visible(data.redox, isRedoxVisible);
  };

  this.visibleBindings = function() {
    return visible(data.binding_energy, isBindingVisible);
  };

  this.visibleSyntheses = function() {
    return visible(data.syntheses, isSynthesisVisible);
  };

  isElementVisible = function(element) {
    if(data.elements[element].disabled) {
      return false;
    }

    for(var index in data.elements[element].includes){
      var resource = data.elements[element].includes[index];
      if (player.data.resources[resource].unlocked) {
        return true;
      }
    }

    return false;
  };

  isGeneratorVisible = function(name) {
    var generator = data.generators[name];
    var condition = "";
    for( var dep in generator.dependencies) {
      condition += "player.data.elements[state.current_element].generators['"
          + generator.dependencies[dep] + "'].level > 0 && ";
    }
    condition += "true";
    return eval(condition);
  };

  // FIXME use eval for the time being, refactor to preprocess conditional functions
  this.isUpgradeVisible = function(name) {
    var upgrade = data.upgrades[name];
    var condition = "";
    for( var pre in upgrade.preconditions) {
      condition += upgrade.preconditions[pre] + " && ";
    }
    for( var dep in upgrade.dependencies) {
      condition += "player.data.elements[state.current_element].upgrades['"
          + upgrade.dependencies[dep] + "'].bought && ";
    }
    condition += "true";

    return eval(condition);
  };

  isResourceVisible = function(name) {
    if(!player.data.resources[name].unlocked){
      return false;
    }

    // This is for global resources e.g. protons, which do not
    // belong to any element
    var elements = data.resources[name].elements;
    if(elements.length === 0){
      return true;
    }

    for(var element in elements){
      if(state.current_element === elements[element]){
        return true;
      }
    }

    return false;
  };

  isEncyclopediaEntryVisible = function(entry) {
    return player.data.unlocks[entry];
  };

  isReactionVisible = function(entry, reaction) {
    if(!player.data.unlocks[reaction]){
      return false;
    }

    for(var reactant in entry.reactant){
      if(!player.data.resources[reactant].unlocked){
        return false;
      }
    }

    for(var element in entry.elements){
      if(state.current_element === entry.elements[element]){
        return true;
      }
    }

    return false;
  };

  isRedoxVisible = function(entry) {
    return isReactionVisible(data.redox[entry], 'redox');
  };

  isBindingVisible = function(entry) {
    return isReactionVisible(data.binding_energy[entry], 'nuclear_binding_energy');
  };

  isSynthesisVisible = function(entry) {
    return isReactionVisible(data.syntheses[entry], 'synthesis');
  };

  this.elementsHasNew = function() {
    for( var key in data.elements) {
      if(player.data.elements[key] !== undefined
          && player.data.elements[key].unlocked && this.elementHasNew(key)) {
        return true;
      }
    }
    return false;
  };

  this.elementHasNew = function(element) {
    var includes = data.elements[element].includes;
    for( var key in includes) {
      if(player.data.resources[includes[key]].unlocked
          && player.data.resources[includes[key]].is_new) {
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
    return false;
  };
}]);
