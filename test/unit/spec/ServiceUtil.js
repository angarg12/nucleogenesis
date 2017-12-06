/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Util service', function() {
  let spec = {};

  commonSpec(spec);

  describe('prettifyNumber', function() {
    it('should return infinity as a symbol', function() {
      let value = spec.util.prettifyNumber(Infinity, spec.state.player);
      expect(value).toEqual('&infin;');
    });

    it('should return empty string as a empty', function() {
      let value = spec.util.prettifyNumber('', spec.state.player);
      expect(value).toEqual('');
    });

    it('should return undefined as undefined', function() {
      let value = spec.util.prettifyNumber();
      expect(value).toBeNull();
    });

    it('should leave small numbers unchanged', function() {
      let value = spec.util.prettifyNumber(1, spec.state.player);
      expect(value).toEqual('1');
    });
  });

  describe('misc functions', function() {
    it('should return globally defined HTML code', function() {
      spec.data.html = {
        'beta-': '&#946;<sup>-</sup>'
      };
      let value = spec.util.getHTML('beta-');

      expect(value).toEqual('&#946;<sup>-</sup>');
    });

    it('should return resource defined HTML code', function() {
      spec.data.resources = {
        '2H': {
          html: '<sup>2</sup>H'
        }
      };
      let value = spec.util.getHTML('2H');

      expect(value).toEqual('<sup>2</sup>H');
    });

    it('should return resources that don\'t have defined HTML code', function() {
      spec.data.resources = {
        'p': {}
      };
      let value = spec.util.getHTML('p');

      expect(value).toEqual('p');
    });
  });

  describe('stats', function() {
    it('should track all time stats', function() {
      spec.data.elements = {
        H: {},
        O: {},
        N: {}
      };
      spec.state.player.statistics.exotic_run = {};
      spec.state.player.statistics.dark_run = {};
      spec.state.player.statistics.all_time = {};

      spec.util.addStatistic(spec.state.player, 'all_time', 'key', 20);

      expect(spec.state.player.statistics.exotic_run).toEqual({});
      expect(spec.state.player.statistics.dark_run).toEqual({});
      expect(spec.state.player.statistics.all_time).toEqual({key:20});
    });

    it('should track dark run stats', function() {
      spec.data.elements = {
        H: {},
        O: {},
        N: {}
      };
      spec.state.player.statistics.exotic_run = {};
      spec.state.player.statistics.dark_run = {};
      spec.state.player.statistics.all_time = {};

      spec.util.addStatistic(spec.state.player, 'dark', 'key', 20);

      expect(spec.state.player.statistics.exotic_run).toEqual({});
      expect(spec.state.player.statistics.dark_run).toEqual({key:20});
      expect(spec.state.player.statistics.all_time).toEqual({key:20});
    });

    it('should track element stats', function() {
      spec.data.elements = {
        H: {},
        O: {},
        N: {}
      };
      spec.state.player.statistics.exotic_run = {};
      spec.state.player.statistics.dark_run = {};
      spec.state.player.statistics.all_time = {};

      spec.util.addStatistic(spec.state.player, 'O', 'key', 20);

      expect(spec.state.player.statistics.exotic_run).toEqual({O:{key:20}});
      expect(spec.state.player.statistics.dark_run).toEqual({key:20});
      expect(spec.state.player.statistics.all_time).toEqual({key:20});
    });

    it('should track stats for all elements', function() {
      spec.data.elements = {
        H: {},
        O: {},
        N: {}
      };
      spec.state.player.statistics.exotic_run = {};
      spec.state.player.statistics.dark_run = {};
      spec.state.player.statistics.all_time = {};

      spec.util.addStatistic(spec.state.player, 'all_elements', 'key', 20);

      expect(spec.state.player.statistics.exotic_run).toEqual({H:{key:20},O:{key:20},N:{key:20}});
      expect(spec.state.player.statistics.dark_run).toEqual({key:20});
      expect(spec.state.player.statistics.all_time).toEqual({key:20});
    });

    it('should add numeric stats', function() {
      spec.state.player.statistics.exotic_run = {O: {key:50}};
      spec.state.player.statistics.dark_run = {key:100};
      spec.state.player.statistics.all_time = {key:200};

      spec.util.addStatistic(spec.state.player, 'O', 'key', 20);

      expect(spec.state.player.statistics.exotic_run).toEqual({O:{key:70}});
      expect(spec.state.player.statistics.dark_run).toEqual({key:120});
      expect(spec.state.player.statistics.all_time).toEqual({key:220});
    });

    it('should replace string stats', function() {
      spec.data.elements = {
        O: {key:'test'}
      };
      spec.state.player.statistics.exotic_run = {};
      spec.state.player.statistics.dark_run = {};
      spec.state.player.statistics.all_time = {};

      spec.util.addStatistic(spec.state.player, 'O', 'key', 'other');

      expect(spec.state.player.statistics.exotic_run).toEqual({O:{key:'other'}});
      expect(spec.state.player.statistics.dark_run).toEqual({key:'other'});
      expect(spec.state.player.statistics.all_time).toEqual({key:'other'});
    });
  });
});
