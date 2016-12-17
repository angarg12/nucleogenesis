describe("Animation service", function() {
  var spec = {};
  
  commonSpec(spec);

  describe('intro animation', function() { 
    it("should call all steps while playing the intro", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['banner'] = false;
      spec.player.data.intro['menu'] = false;
      spec.player.data.intro['content'] = false;
      
      spec.animation.introAnimation();
      
      // we need spec to simplify the test
      spec.$timeout.cancel(spec.controller.onload);
      spec.$timeout.flush();
      
      expect(spec.player.data.intro['banner']).toEqual(true);
      expect(spec.player.data.intro['menu']).toEqual(true);
      expect(spec.player.data.intro['content']).toEqual(true);
    });
        
    it("should take a step", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['banner'] = false;
      
      spec.animation.introStep('banner');
      
      expect(spec.player.data.intro['banner']).toEqual(true);
    });
    
    it("should not flip other states", function() {
      spec.player.data = {intro:{}};
      spec.player.data.intro['menu'] = false;
      spec.player.data.intro['content'] = true;
      
      spec.animation.introStep('banner');
      
      expect(spec.player.data.intro['menu']).toEqual(false);
      expect(spec.player.data.intro['content']).toEqual(true);
    });
  });
});