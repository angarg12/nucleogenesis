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

      /* Achievement functions are derived from the data file. This template
      variable will be replaced with the achievement conditions */
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
      }

      /* Checks if the player has unlocked any new achievement. */
      self.checkAchievements = function(player) {
        for (let key in data.achievements) {
          let achievement = data.achievements[key];
          let levels = achievement.goals.length;
          
          if (player.achievements[key] < levels) {
            checkAchievement(player, key, achievement);
          }
        }
      };

      /* Checks all the levels of an achievement that the player hasn't unlocked
        yet. */
      function checkAchievement(player, key, achievement) {
        // start from the current achievement level and go up
        for(let level = player.achievements[key]; level < achievement.goals.length; level++){
          // if the progress of the player is bigger than the goal, unlock it
          let progress = self[achievement.progress](player);

          if (progress >= achievement.goals[level]) {
            addToast(achievement.name);
            visibility.addNew(achievement);
            player.achievements[key] = level+1;
            $window.ga('send', 'event', 'achievement', key+'-'+level, player.id, Date.now());
          }
        }
      }
    }
  ]);
