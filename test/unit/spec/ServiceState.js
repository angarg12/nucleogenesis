/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Achievement service', function () {
  let spec = {};

  commonSpec(spec);

  describe('toast functions', function () {
    it('should remove toasts', function () {
      spec.state.toast = ['test'];
      spec.state.isToastVisible = true;

      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should not flip the visibility when removing toasts', function () {
      spec.state.toast = ['test'];
      spec.state.isToastVisible = false;

      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should not fail on empty toast queues', function () {
      spec.state.toast = [];
      spec.state.isToastVisible = true;

      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should delete toasts', function () {
      spec.state.toast = ['test'];

      spec.state.deleteToast();

      expect(spec.state.toast).toEqual([]);
    });

    it('should shift toasts', function () {
      spec.state.toast = ['test', 'test2'];

      spec.state.deleteToast();

      expect(spec.state.toast).toEqual(['test2']);
    });

    it('should make upcoming toasts visible', function () {
      spec.state.toast = ['test', 'test2'];
      spec.state.isToastVisible = false;

      spec.state.deleteToast();

      expect(spec.state.isToastVisible).toEqual(true);
    });

    it('should not fail on delete empty lists', function () {
      spec.state.toast = [];

      spec.state.deleteToast();

      expect(spec.state.toast).toEqual([]);
    });
  });
});
