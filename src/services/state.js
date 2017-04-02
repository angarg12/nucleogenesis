angular
.module('incremental')
.service('state',
['player',
'achievement',
function(player,achievement) {
    this.current_tab = "Elements";
    // FIXME these keys couple the controller to the data in non-obvious ways
    // e.g. if the keys change, the controller breaks. to fix, point them to the first element
    this.current_element = "H";
    this.hover_element = "";

    this.init = function () {
      this.current_tab = "Elements";
      this.current_element = "H";
      this.hover_element = "";
      player.initialisePlayer();
      achievement.init();
    };
}]);
