/* globals describe,commonSpec,it,expect */
// jshint varstmt: false
'use strict';

describe('Achievement service', function() {
  var spec = {};

  commonSpec(spec);

  describe('toast functions', function() {
    it('should add toasts to an empty queue', function() {
      spec.achievement.toast = [];
      spec.achievement.is_toast_visible = false;

      spec.achievement.addToast('test');

      expect(spec.achievement.toast.length).toEqual(1);
      expect(spec.achievement.toast[0]).toEqual('test');
      expect(spec.achievement.is_toast_visible).toEqual(true);
    });

    it('should add toasts to an non empty queue', function() {
      spec.achievement.toast = ['a'];

      spec.achievement.addToast('test');

      expect(spec.achievement.toast.length).toEqual(2);
      expect(spec.achievement.toast[1]).toEqual('test');
    });

    it('should not change the visibility of non empty queue', function() {
      spec.achievement.toast = ['a'];
      spec.achievement.is_toast_visible = false;

      spec.achievement.addToast('test');

      expect(spec.achievement.is_toast_visible).toEqual(false);
    });

    it('should remove toasts', function() {
      spec.achievement.toast = ['test'];
      spec.achievement.is_toast_visible = true;

      spec.achievement.removeToast();

      expect(spec.achievement.is_toast_visible).toEqual(false);
    });

    it('should not flip the visibility when removing toasts', function() {
      spec.achievement.toast = ['test'];
      spec.achievement.is_toast_visible = false;

      spec.achievement.removeToast();

      expect(spec.achievement.is_toast_visible).toEqual(false);
    });

    it('should not fail on empty toast queues', function() {
      spec.achievement.toast = [];
      spec.achievement.is_toast_visible = true;

      spec.achievement.removeToast();

      expect(spec.achievement.is_toast_visible).toEqual(false);
    });

    it('should delete toasts', function() {
      spec.achievement.toast = ['test'];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual([]);
    });

    it('should shift toasts', function() {
      spec.achievement.toast = ['test','test2'];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual(['test2']);
    });

    it('should make upcoming toasts visible', function() {
      spec.achievement.toast = ['test','test2'];
      spec.achievement.is_toast_visible = false;

      spec.achievement.deleteToast();

      expect(spec.achievement.is_toast_visible).toEqual(true);
    });

    it('should not fail on delete empty lists', function() {
      spec.achievement.toast = [];

      spec.achievement.deleteToast();

      expect(spec.achievement.toast).toEqual([]);
    });
  });

  describe('achievements', function() {

  });
});
