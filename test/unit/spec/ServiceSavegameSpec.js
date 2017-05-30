/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect,beforeEach,spyOn,window */
/* jshint varstmt: false */
'use strict';

/**
 * Spying on localStorage methods is not possible without replacing it by a
 * mock object on Firefox. It's important to mock only just before calling
 * spyOn(localStorage, ...) and to restore the original object by calling
 * unmockLocalStorage before continueing with other tests.
 *
 * This only works if localStorage is configurable - no way to mock it if it
 * isn't... (but maybe mocks are not required anyway)
 *
 * Important: Keep all copies of this code snippet in sync across test files!
 *
 * See: https://github.com/jasmine/jasmine/issues/299
 */
(function () {
  let originalLocalStorage = window.localStorage;
  let supportsModification = Object.getOwnPropertyDescriptor(window, 'localStorage').configurable;

  function mockLocalStorage() {
    if (!supportsModification) {
      return;
    }

    let mock = (function () {
      let store = {};
      return {
        'getItem': function (key) {
          return store[key];
        },
        'setItem': function (key, value) {
          store[key] = value.toString();
        },
        'removeItem': function (key) {
          delete store[key];
        },
        'clear': function () {
          store = {};
        }
      };
    })();

    Object.defineProperty(window, 'localStorage', {
      'value': mock,
      'configurable': true,
      'enumerable': true,
      'writable': true
    });
  }
  window.mockLocalStorage = mockLocalStorage;

  function unmockLocalStorage() {
    if (!supportsModification) {
      return;
    }

    Object.defineProperty(window, 'localStorage', {
      'value': originalLocalStorage,
      'configurable': true,
      'enumerable': true,
      'writable': true
    });
  }
  window.unmockLocalStorage = unmockLocalStorage;
})();

describe('Save service', function () {
  let spec = {};

  commonSpec(spec);
  window.mockLocalStorage();

  describe('save and load', function () {
    let getItemSpy;

    beforeEach(function () {
      getItemSpy = spyOn(localStorage, 'getItem');
      spyOn(localStorage, 'setItem');
      spyOn(localStorage, 'removeItem');
    });

    it('should save player data', function () {
      spec.savegame.save();

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should load player data', function () {
      getItemSpy.and.returnValue('{}');
      spyOn(spec.savegame, 'reset');

      spec.savegame.load();

      expect(localStorage.getItem).toHaveBeenCalled();
      expect(spec.savegame.reset).not.toHaveBeenCalled();
    });

    it('should load player data and throw exception', function () {
      spyOn(spec.savegame, 'reset');

      spec.savegame.load();

      expect(localStorage.getItem).toHaveBeenCalled();
      expect(spec.savegame.reset).toHaveBeenCalled();
    });

    it('should reset player without confirmation', function () {
      spyOn(spec.state, 'init');

      spec.savegame.reset(false);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(spec.state.init).toHaveBeenCalled();
    });

    it('should reset player with confirmation', function () {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(spec.state, 'init');

      spec.savegame.reset(true);

      expect(localStorage.removeItem).toHaveBeenCalled();
      expect(spec.state.init).toHaveBeenCalled();
    });

    it('should not reset player if the confirmation rejets', function () {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(spec.state, 'init');

      spec.savegame.reset(true);

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(spec.state.init).not.toHaveBeenCalled();
    });

    it('should export save', function () {
      spyOn(window, 'btoa').and.returnValue('');

      spec.savegame.exportSave();

      expect(window.btoa).toHaveBeenCalled();
    });

    it('should import save', function () {
      spyOn(window, 'prompt').and.returnValue('test');
      spyOn(JSON, 'parse').and.returnValue('{}');
      spyOn(spec.savegame, 'save');

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(JSON.parse).toHaveBeenCalled();
      expect(spec.savegame.save).toHaveBeenCalled();
    });

    it('should not import if save is not presented', function () {
      spyOn(window, 'prompt').and.returnValue('');
      spyOn(window, 'atob').and.returnValue('{}');
      spyOn(spec.savegame, 'save');

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).not.toHaveBeenCalled();
      expect(spec.savegame.save).not.toHaveBeenCalled();
    });

    it('should not import if save is invalid', function () {
      spyOn(window, 'prompt').and.returnValue('test');
      spyOn(window, 'atob');
      spyOn(spec.savegame, 'save');

      spec.savegame.importSave();

      expect(window.prompt).toHaveBeenCalled();
      expect(window.atob).toHaveBeenCalled();
      expect(spec.savegame.save).not.toHaveBeenCalled();
    });
  });
});
