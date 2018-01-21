/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach,window */
/* jshint varstmt: false */
'use strict';

describe('Achievements component', function () {
  let spec = {};

  commonSpec(spec);

  beforeEach(function () {
    window.ga = function () {};
    spec.state.player.resources['1H'] = {};
    spec.state.player.resources['1H'] = 0;
    spec.state.player.resources['2H'] = {};
    spec.state.player.resources['2H'] = 0;
    spec.state.player.achievements.hydrogen = 0;
    spec.state.player.achievements.isotope = 0;

    spec.data.achievements.hydrogen = {
      'goals': [
        1000000,
        1000000000
      ],
      'progress': 'hydrogen',
      'deps': [
        'H'
      ]
    };
    spec.achievements.hydrogen = function(p){return p.resources['1H'];};
    spec.data.achievements.isotope = {
      'name': 'xxx',
      'description': 'xxx',
      'goals': [
        1
      ],
      'progress': 'isotope',
      'deps': [
        'isotope'
      ]
    };
    spec.achievements.isotope = function(p){return p.resources['2H'] !== null ? 1 : 0;};
  });

  describe('achievement functions', function () {
    it('should execute all achievement functions', function () {
      for(let key of Object.keys(spec.originalData)){
        spec.data[key] = angular.copy(spec.originalData[key]);
      }

      spec.state.update(spec.data.start_player);
    });

    it('should execute all achievement functions 2', function () {
      for(let key of Object.keys(spec.originalData)){
        spec.data[key] = angular.copy(spec.originalData[key]);
      }
      for(let unlock in spec.data.unlocks){
        spec.data.start_player.unlocks[unlock] = 1;
      }
      for(let resource in spec.data.resources){
        spec.data.start_player.resources[resource] = 1e300;
      }

      spec.state.update(spec.data.start_player);
    });

    it('should execute all achievement functions 3', function () {
      for(let key of Object.keys(spec.originalData)){
        spec.data[key] = angular.copy(spec.originalData[key]);
      }
      for(let resource in spec.data.resources){
        spec.data.start_player.resources[resource] = 1e300;
      }

      spec.state.update(spec.data.start_player);
    });
  });

  describe('achievements', function () {
    it('should not award achievements if conditions are not met', function () {
      spec.state.update(spec.state.player);

      expect(spec.state.player.achievements.hydrogen).toEqual(0);
    });

    it('should award achievements if conditions are met', function () {
      spec.state.player.resources['1H'] = 1000000000;

      spec.state.update(spec.state.player);

      expect(spec.state.player.achievements.hydrogen).toEqual(2);
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
      spec.state.player.achievements.hydrogen = 2;
      let maxed = spec.achievements.maxed('hydrogen', spec.state.player);

      expect(maxed).toBeTruthy();
    });

    it('should return false if an achievement is not maxed', function () {
      spec.state.player.achievements.hydrogen = 1;
      let maxed = spec.achievements.maxed('hydrogen', spec.state.player);

      expect(maxed).toBeFalsy();
    });

    it('should return false if an achievement is level 0', function () {
      let progress = spec.achievements.inProgress('hydrogen', spec.state.player);

      expect(progress).toBeFalsy();
    });

    it('should return true if an achievement is in progress', function () {
      spec.state.player.achievements.hydrogen = 1;
      let progress = spec.achievements.inProgress('hydrogen', spec.state.player);

      expect(progress).toBeTruthy();
    });

    it('should return false if an achievement is maxed', function () {
      spec.state.player.achievements.hydrogen = 2;
      let progress = spec.achievements.inProgress('hydrogen', spec.state.player);

      expect(progress).toBeFalsy();
    });

    it('should return the level of the achievement', function () {
      let level = spec.achievements.getLevel('hydrogen', spec.state.player);

      expect(level).toEqual(1);
    });

    it('should cap the level at the maximum', function () {
      spec.state.player.achievements.hydrogen = 10;
      spec.data.achievements.hydrogen.goals = [1, 2, 3];
      let level = spec.achievements.getLevel('hydrogen', spec.state.player);

      expect(level).toEqual(3);
    });

    it('should count the total number of achievement levels', function () {
      let level = spec.achievements.numberTotal();

      expect(level).toEqual(3);
    });

    it('should count the number of unlocked achivements 1', function () {
      let level = spec.achievements.numberUnlocked(spec.state.player);

      expect(level).toEqual(0);
    });

    it('should count the number of unlocked achivements 2', function () {
      spec.state.player.achievements.hydrogen = 2;
      let level = spec.achievements.numberUnlocked(spec.state.player);

      expect(level).toEqual(2);
    });

    it('should count the number of unlocked achivements 3', function () {
      spec.state.player.achievements.hydrogen = 2;
      spec.state.player.achievements.isotope = 1;
      let level = spec.achievements.numberUnlocked(spec.state.player);

      expect(level).toEqual(3);
    });

    it('should hide achievements that are not visible', function () {
      spec.state.player.unlocks.H = 0;
      spec.state.player.unlocks.isotope = 0;

      let visible = spec.achievements.visibleAchievements(spec.state.player);

      expect(visible).toEqual([]);
    });

    it('should show visible achievements', function () {
      spec.state.player.unlocks.H = 1;
      spec.state.player.unlocks.isotope = 0;

      let visible = spec.achievements.visibleAchievements(spec.state.player);

      expect(visible).toEqual(['hydrogen']);
    });
  });
});
