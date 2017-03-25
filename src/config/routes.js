angular
.module('incremental')
.config(function($locationProvider, $routeProvider) {
  $routeProvider
  .when("/matter", {
    templateUrl : "src/templates/matter.html"
  })
  .when("/encyclopedia", {
    templateUrl : "src/templates/encyclopedia.html"
  })
  .when("/table", {
    templateUrl : "src/templates/table.html"
  })
  .when("/options", {
    templateUrl : "src/templates/options.html"
  })
  .otherwise({
    templateUrl : "src/templates/matter.html"
  });
  // we need to do this because angular 1.6
  // http://stackoverflow.com/questions/41226122/url-hash-bang-prefix-instead-of-simple-hash
  $locationProvider.hashPrefix('');
});
