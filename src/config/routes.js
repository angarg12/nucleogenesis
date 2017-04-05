angular
.module('incremental')
.config(['$stateProvider',
  function($stateProvider) {
  $stateProvider.state("matter", {
    templateUrl : "src/templates/matter.html"
  })
  .state("encyclopedia", {
    templateUrl : "src/templates/encyclopedia.html"
  })
  .state("table", {
    templateUrl : "src/templates/table.html"
  })
  .state("options", {
    templateUrl : "src/templates/options.html"
  });

  // we need to do this because angular 1.6
  // http://stackoverflow.com/questions/41226122/url-hash-bang-prefix-instead-of-simple-hash
  // $locationProvider.hashPrefix('');
}]).run([
  "$state",
   function($state){
      $state.go('matter');
   }
]);
