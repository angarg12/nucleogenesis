'use strict';

angular
  .module('game')
  .config(['$translateProvider', function ($translateProvider) {
    <%= language %>

  $translateProvider.preferredLanguage('en');

  $translateProvider.useSanitizeValueStrategy('sanitize');
}]);
