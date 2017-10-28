/* globals describe,it,expect,beforeEach, require, browser, element, by */
/* jshint varstmt: false */
'use strict';

describe('Game index', function() {
  let player;
  let LocalStorage = require("../helper/LocalStorage.js");

  beforeEach(function(){
    player = require('../../../build/data/start_player.json');
    browser.ignoreSynchronization = true;
  });

  it('should calculate total production', function() {
    // we need to load the page to set the player and load it again to load the save
    browser.get('http://localhost:9000/index.html');

    player.element_slots[0].generators = {'1': 10, '2': 10, '5': 5};

    LocalStorage.setValue(JSON.stringify(player));

    browser.get('http://localhost:9000/index.html');

    expect(element(by.id('production_total')).getText()).toEqual('310');
  });
});
