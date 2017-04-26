angular
.module('incremental')
.service('achievement',
['$timeout',
'data',
function($timeout, data) {
  self = this;
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
    for(var achievement in data.achievements){
      if(!player.achievements[achievement]){
        item = data.achievements[achievement];

        if(this[item.condition](player)){
          this.addToast(item.name);
          player.achievements[achievement] = true;
        }
      }
    }
  };
}]);
