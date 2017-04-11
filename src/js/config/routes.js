angular
.module('incremental')
.config(['$stateProvider',
  function($stateProvider) {
  $stateProvider.state("matter", {
    templateUrl : "templates/matter.html"
  })
  .state("encyclopedia", {
    templateUrl : "templates/encyclopedia.html"
  })
  .state("table", {
    templateUrl : "templates/table.html"
  })
  .state("options", {
    templateUrl : "templates/options.html"
  });
}]).run([
  "$state",
   function($state){
      $state.go('matter');
   }
]);
