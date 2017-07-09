/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Achievements component', function () {
  let spec = {};

  commonSpec(spec);

  describe('achievements', function () {
    it('should not award achievements if conditions are not met', function () {
      spec.data.start_player.resources['1H'] = 0;
      let playerCopy = angular.copy(spec.data.start_player);

      spec.state.update(playerCopy);

      expect(playerCopy.achievements).toEqual(spec.data.start_player.achievements);
    });

    it('should award achievements if conditions are met', function () {
      window.ga = function () {};
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.resources['1H'].number = spec.data.achievements.hydrogen.goals[1];

      spec.state.update(playerCopy);

      expect(playerCopy.achievements.hydrogen).toEqual(2);
    });

    it('should return true if an achievement has progress', function () {
      let progress = spec.achievements.hasProgress('hydrogen');

      expect(progress).toBeTruthy();
    });

    it('should return false if an achievement doesn\'t have progress', function () {
      let progress = spec.achievements.hasProgress('isotope');

      expect(progress).toBeFalsy();
    });

    it('should return true if an achievement is maxed', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 2;
      let maxed = spec.achievements.maxed('hydrogen', playerCopy);

      expect(maxed).toBeTruthy();
    });

    it('should return false if an achievement is not maxed', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 1;
      let maxed = spec.achievements.maxed('hydrogen', playerCopy);

      expect(maxed).toBeFalsy();
    });

    it('should return false if an achievement is level 0', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 0;
      let progress = spec.achievements.inProgress('hydrogen', playerCopy);

      expect(progress).toBeFalsy();
    });

    it('should return true if an achievement is in progress', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 1;
      let progress = spec.achievements.inProgress('hydrogen', playerCopy);

      expect(progress).toBeTruthy();
    });

    it('should return false if an achievement is maxed', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 2;
      let progress = spec.achievements.inProgress('hydrogen', playerCopy);

      expect(progress).toBeFalsy();
    });

    it('should return the level of the achievement', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 0;
      let level = spec.achievements.getLevel('hydrogen', playerCopy);

      expect(level).toEqual(1);
    });

    it('should cap the level at the maximum', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 10;
      spec.data.achievements.hydrogen.goals = [1,2,3];
      let level = spec.achievements.getLevel('hydrogen', playerCopy);

      expect(level).toEqual(3);
    });

    it('should count the number of unlocked achivements 1', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      let level = spec.achievements.numberUnlocked (playerCopy);

      expect(level).toEqual(0);
    });

    it('should count the number of unlocked achivements 2', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 2;
      let level = spec.achievements.numberUnlocked (playerCopy);

      expect(level).toEqual(2);
    });

    it('should count the number of unlocked achivements 3', function () {
      let playerCopy = angular.copy(spec.data.start_player);
      playerCopy.achievements.hydrogen = 2;
      playerCopy.achievements.isotope = 1;
      let level = spec.achievements.numberUnlocked (playerCopy);

      expect(level).toEqual(3);
    });
  });
});
