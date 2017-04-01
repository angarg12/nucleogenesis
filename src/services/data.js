angular.module('incremental').service(
'data',
['$http',
'$q',
function($http, $q) {
  var self = this;
  this.version = '1.0.4';

  this.table_resources = [ "e-", "n", "p" ];

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
        self[file] = response.data;
      });
    });

    return $q.all(promises);
  };
}]);
