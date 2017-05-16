'use strict';

angular
.module('incremental')
.service('achievement',
['$window',
'$timeout',
'data',
'visibility',
function($window, $timeout, data, visibility) {
  let self = this;
  self.toast = [];
  self.is_toast_visible = false;

  <%= functions %>

  this.init = function (){
    self.toast = [];
    self.is_toast_visible = false;
  };

  this.deleteToast = function () {
    self.toast.shift();
    if(self.toast.length > 0) {
      self.is_toast_visible = true;
    }
  };

  this.removeToast = function () {
    self.is_toast_visible = false;
    $timeout(this.deleteToast, 1100);
  };

  this.addToast = function (t) {
    self.toast.push(t);
    if(this.toast.length == 1) {
      self.is_toast_visible = true;
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
