'use strict';

angular
  .module('game')
  .service('synthesis', ['state',
    'reaction',
    'data',
    function (state, reaction, data) {
      let ct = this;

      ct.synthesisPower = function (synthesis) {
        let level = state.player.syntheses[synthesis].active;
        return Math.ceil(Math.pow(level, data.constants.SYNTH_POWER_INCREASE));
      };
    }
  ]);
