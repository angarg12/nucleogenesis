/**
 Achievement
 This component is responsible for checking, unlocking and
 displaying achievements.
 Achievement progress functions are generated at build time
 out of the achievements data, and replaces in the lodash
 template parameter.

 @namespace Components
 */
'use strict';

angular.module('game').component('achievements', {
  templateUrl: 'views/achievements.html',
  controller: 'ct_achievements',
  controllerAs: 'ct'
});

angular.module('game').controller('ct_achievements', ['$window', 'state', 'data', 'visibility',
  function ($window, state, data, visibility) {
    /* Achievement functions are derived from the data file. This template
    variable will be replaced with the achievement conditions */
    <%= functions %>

    let ct = this;
    ct.state = state;
    ct.data = data;

    /* Does the achievement have progress, or is it a boolean? */
    ct.hasProgress = function (key) {
      return data.achievements[key].goals.length > 1 ||
        data.achievements[key].goals[0] !== 1;
    };

    ct.maxed = function (key, player) {
      return player.achievements[key] >= data.achievements[key].goals.length;
    };

    ct.inProgress = function (key, player) {
      return player.achievements[key] > 0 &&
        player.achievements[key] < data.achievements[key].goals.length;
    };

    ct.getLevel = function (key, player) {
      return Math.min(data.achievements[key].goals.length, player.achievements[key] + 1);
    };

    ct.numberTotal = function () {
      let total = 0;
      for (let key in data.achievements) {
        total += data.achievements[key].goals.length;
      }
      return total;
    };

    ct.numberUnlocked = function (player) {
      let total = 0;
      for (let key in data.achievements) {
        total += player.achievements[key];
      }
      return total;
    };

    /* Checks if the player has unlocked any new achievement. */
    function update(player) {
      // If we check only achievements that are visible we save A LOT of work
      let visible = ct.visibleAchievements(ct.state.currentElement);
      let shortList = {};
      for(let key of visible){
        shortList[key] = data.achievements[key];
      }
      checkAchievements(player, shortList, 'achievements');
      checkAchievements(player, data.unlocks, 'unlocks');
    }

    function checkAchievements(player, source, target){
      for (let key in source) {
        let achievement = source[key];
        let levels = achievement.goals.length;

        if (player[target][key] < levels) {
          checkAchievement(player, target, key, achievement);
        }
      }
    }

    /* Checks all the levels of an achievement that the player hasn't unlocked
      yet. */
    function checkAchievement(player, source, key, achievement) {
      // start from the current achievement level and go up
      for (let level = player[source][key]; level < achievement.goals.length; level++) {
        // if the progress of the player is bigger than the goal, unlock it
        let progress = ct.getProgress(key, source, player);

        if (progress >= 100) {
          player[source][key] = level + 1;
          if(achievement.name){
            state.addToast(achievement.name);
          }
          $window.ga('send', 'event', 'achievement', key + '-' + level, player.id, Date.now());
        }
      }
    }

    ct.getProgress = function (key, source, player) {
      let level = player[source][key];
      let achievement = data[source][key];
      let amount = ct[achievement.progress](player);
      let progress = amount / achievement.goals[level] * 100;

      return Math.min(100, progress);
    };

    ct.visibleAchievements = function (currentElement) {
      return visibility.visible(data.achievements, isAchievementVisible, currentElement);
    };

    function isAchievementVisible(name) {
      let achievement = data.achievements[name];
      for (let dep of achievement.deps) {
        if (state.player.unlocks[dep] === 0) {
          return false;
        }
      }

      return true;
    }

    state.registerUpdate('achievement', update);
  }
]);
