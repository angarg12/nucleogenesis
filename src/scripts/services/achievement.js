'use strict';

angular
.module('game')
.service('achievement',
['$window',
'$timeout',
'data',
'visibility',
function($window, $timeout, data, visibility) {
  let self = this;
  self.toast = [];
  self.isToastVisible = false;

  <%= functions %>

  this.init = function (){
    self.toast = [];
    self.isToastVisible = false;
  };

  this.deleteToast = function () {
    self.toast.shift();
    if(self.toast.length > 0) {
      self.isToastVisible = true;
    }
  };

  this.removeToast = function () {
    self.isToastVisible = false;
    $timeout(this.deleteToast, 1100);
  };

  this.addToast = function (t) {
    self.toast.push(t);
    if(this.toast.length == 1) {
      self.isToastVisible = true;
    }
  };

  this.checkAchievements = function (player) {
    for(let achievement in data.achievements){
      if(!player.achievements[achievement]){
        let item = data.achievements[achievement];

        if(this[item.condition](player)){
          this.addToast(item.name);
          visibility.addNew(achievement);
          player.achievements[achievement] = true;
          $window.ga('send', 'event', 'achievement', achievement, player.id, Date.now());
        }
      }
    }
  };
}]);
