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
  });
});
