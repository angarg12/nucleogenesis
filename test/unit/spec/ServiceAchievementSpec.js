/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Achievement service', function () {
  var spec = {};

  commonSpec(spec);

  describe('toast functions', function () {
    it('should add toasts to an empty queue', function () {
      spec.achievement.toast = [];
      spec.achievement.isToastVisible = false;

      // we check achievements to activate add toast
      spec.achievement.checkAchievements(spec.data.start_player);

      expect(spec.achievement.toast.length).toEqual(1);
      expect(spec.achievement.isToastVisible).toEqual(true);
    });

    it('should add toasts to an non empty queue', function () {
      spec.achievement.toast = ['a'];

      // we check achievements to activate add toast
      spec.achievement.checkAchievements(spec.data.start_player);

      expect(spec.achievement.toast.length).toEqual(2);
    });

    it('should not change the visibility of non empty queue', function () {
      spec.achievement.toast = ['a'];
      spec.achievement.isToastVisible = false;

      // we check achievements to activate add toast
      spec.achievement.checkAchievements(spec.data.start_player);

      expect(spec.achievement.isToastVisible).toEqual(false);
    });

    it('should remove toasts', function () {
      spec.achievement.toast = ['test'];
      spec.achievement.isToastVisible = true;

      spec.achievement.removeToast();

      expect(spec.achievement.isToastVisible).toEqual(false);
    });

    it('should not flip the visibility when removing toasts', function () {
      spec.achievement.toast = ['test'];
      spec.achievement.isToastVisible = false;

      spec.achievement.removeToast();

      expect(spec.achievement.isToastVisible).toEqual(false);
    });

    it('should not fail on empty toast queues', function () {
      spec.achievement.toast = [];
      spec.achievement.isToastVisible = true;

      spec.achievement.removeToast();

      expect(spec.achievement.isToastVisible).toEqual(false);
    });

    it('should delete toasts', function () {
      spec.achievement.toast = ['test'];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual([]);
    });

    it('should shift toasts', function () {
      spec.achievement.toast = ['test', 'test2'];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual(['test2']);
    });

    it('should make upcoming toasts visible', function () {
      spec.achievement.toast = ['test', 'test2'];
      spec.achievement.isToastVisible = false;

      spec.achievement.deleteToast();

      expect(spec.achievement.isToastVisible).toEqual(true);
    });

    it('should not fail on delete empty lists', function () {
      spec.achievement.toast = [];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual([]);
    });
  });

  describe('achievements', function () {
    it('should not award achievements if conditions are not met', function () {
      spec.data.start_player.resources['1H'] = 0;
      let playerCopy = angular.copy(spec.data.start_player);

      spec.achievement.checkAchievements(playerCopy);

      expect(playerCopy.achievements).toEqual(spec.data.start_player.achievements);
    });

    it('should award achievements if conditions are met', function () {
      window.ga = function () {};
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.resources['1H'].number = 1e15;

      spec.achievement.checkAchievements(playerCopy);

      expect(playerCopy.achievements.hydrogen_ii).toEqual(true);
    });
  });
});
