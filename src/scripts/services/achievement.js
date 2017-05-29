'use strict';

angular
  .module('game')
  .service('achievement', ['$window',
    '$timeout',
    'data',
    'visibility',
    function($window, $timeout, data, visibility) {
      let self = this;
      self.toast = [];
      self.isToastVisible = false;

      <%= functions %>

      self.init = function() {
        self.toast = [];
        self.isToastVisible = false;
      };

      self.deleteToast = function() {
        self.toast.shift();
        if (self.toast.length > 0) {
          self.isToastVisible = true;
        }
      };

      self.removeToast = function() {
        self.isToastVisible = false;
        $timeout(self.deleteToast, 1100);
      };

      function addToast(t) {
        self.toast.push(t);
        if (self.toast.length == 1) {
          self.isToastVisible = true;
        }
      };

      self.checkAchievements = function(player) {
        for (let achievement in data.achievements) {
          if (!player.achievements[achievement]) {
            let item = data.achievements[achievement];

            if (self[item.condition](player)) {
              addToast(item.name);
              visibility.addNew(achievement);
              player.achievements[achievement] = true;
              $window.ga('send', 'event', 'achievement', achievement, player.id, Date.now());
            }
          }
        }
      };
    }
  ]);
