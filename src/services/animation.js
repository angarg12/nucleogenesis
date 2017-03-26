angular
.module('incremental')
.service('animation',
['$timeout',
'player',
function($timeout, player) {
  var self = this;

  this.introAnimation = function () {
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
    player.data.intro[value] = true;
  };
}]);
