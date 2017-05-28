'use strict';

angular.module('game').component('redox', {
  templateUrl: 'views/redox.html',
  controller: ['state', 'data', 'visibility', 'util', 'format', 'reaction', redox],
  controllerAs: 'ct'
});

function redox(state, data, visibility, util, format, reaction) {
  let ct = this;
  ct.state = state;
  ct.data = data;
  ct.visibility = visibility;
  ct.util = util;
  ct.format = format;
  ct.reaction = reaction;
}
