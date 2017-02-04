angular.module('incremental').service(
'data',
['$http',
'$q',
function($http, $q) {
  var self = this;
  self.$scope;

  this.files = ["elements",
              "generators",
              "upgrades",
              "encyclopedia",
              "periodic_table",
              "resources",
              "unlocks",
              "radioisotopes",
              "html",
              "syntheses",
              "binding_energy",
              "redox"];
  
  this.loadData = function() {
    var promises = this.files.map(function(file){
      return $http.get('src/data/'+file+'.json').then(function(response) {
        self.$scope[file] = response.data;
      });
    });
    
    return $q.all(promises);
  };

  // FIXME: temporary until we get rid of scope
  this.setScope = function(scope) {
    self.$scope = scope;

    self.$scope.table_resources = [ "e-", "n", "p" ];

    self.$scope.upgradeApply = function(resource, power) {
      return resource * power;
    };
  };
} ]);
