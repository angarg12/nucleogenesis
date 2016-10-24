describe("Incremental table elements", function() {
  beforeEach(module('incremental'));

  var $controller;

  beforeEach(inject(function(_$rootScope_, _$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
	$rootScope = _$rootScope_
	spyOn($rootScope, '$emit').and.callThrough();
  }));

  describe('$scope.prettifyNumber', function() {
    var $scope, controller;

    beforeEach(function() {
	  $scope = $rootScope.$new(),
	  controller = $controller('IncCtrl', {$scope:$scope});
    });

	  it("should return inifinity as a symbol", function() {
		inf = $scope.prettifyNumber(Infinity);
		expect(inf).toEqual("&infin;");
	  });
  });
/*
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
  */
});
