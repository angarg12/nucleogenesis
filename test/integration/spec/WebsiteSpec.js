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

    player.elements.H.generators["1"] = 10;
    player.elements.H.generators["2"] = 10;
    player.elements.H.generators["5"] = 5;
    LocalStorage.setValue(JSON.stringify(player));

    browser.get('http://localhost:9000/index.html');

    expect(element(by.id('production_total')).getText()).toEqual('13,110');
  });
});
