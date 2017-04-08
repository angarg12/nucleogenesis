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
}]).run([
  "$state",
   function($state){
      $state.go('matter');
   }
]);
