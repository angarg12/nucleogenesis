/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('State', function () {
  let spec = {};

  commonSpec(spec);

  describe('toast functions', function () {
    it('should add toasts', function () {
      spec.data.achievements.test = {};
      spec.state.toast = [];
      spec.state.isToastVisible = false;

      spec.state.addToast('test');

      expect(spec.state.toast).toEqual(['test']);
      expect(spec.state.isToastVisible).toEqual(true);
    });

    it('should remove toasts', function () {
      spec.state.toast = ['test'];
      spec.state.isToastVisible = true;

      spyOn(performance, 'now').and.returnValues(0, 5000);
      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should not flip the visibility when removing toasts', function () {
      spec.state.toast = ['test'];
      spec.state.isToastVisible = false;

      spyOn(performance, 'now').and.returnValues(0, 5000);
      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should not fail on empty toast queues', function () {
      spec.state.toast = [];
      spec.state.isToastVisible = true;

      spyOn(performance, 'now').and.returnValues(0, 5000);
      spec.state.removeToast();

      expect(spec.state.isToastVisible).toEqual(false);
    });

    it('should delete toasts', function () {
      spec.state.toast = ['test'];

      spyOn(performance, 'now').and.returnValues(0, 5000);
      spec.state.deleteToast();

      expect(spec.state.toast).toEqual([]);
    });

    it('should shift toasts', function () {
      spec.state.toast = ['test', 'test2'];
      
      spyOn(performance, 'now').and.returnValues(0, 5000);
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

  describe('has new functions', function() {
    it('should return true if an element has new items', function() {
      spec.data.elements.H = {
        includes: ['1H']
      };
      spec.state.addNew('1H');

      let hasNew = spec.state.elementHasNew('H');
      expect(hasNew).toBeTruthy();
    });

    it('should return false if an element has no new items', function() {
      spec.data.elements.H = {
        includes: ['2H','3H','1H-']
      };

      let hasNew = spec.state.elementHasNew('H');
      expect(hasNew).toBeFalsy();
    });

    it('should add and remove items correctly', function() {
      spec.state.addNew('1H');

      let hasNew = spec.state.hasNew('1H');

      expect(hasNew).toBeTruthy();

      spec.state.removeNew('1H');

      hasNew = spec.state.hasNew('1H');

      expect(hasNew).toBeFalsy();
    });

    it('should not remove items that aren\'t there', function() {
      spec.state.removeNew('1H');

      let hasNew = spec.state.hasNew('1H');

      expect(hasNew).toBeFalsy();
    });
  });
});
