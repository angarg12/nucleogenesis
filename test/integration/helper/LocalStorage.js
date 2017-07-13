"use strict";

let LocalStorage = function () {
    this.getValue = function (key) {
        return browser.executeScript("return window.localStorage.getItem('" + key + "');");
    };

    this.setValue = function (key) {
      return browser.executeScript("window.localStorage.setItem('player','" + key + "');");
    };

    this.clear = function () {
        browser.executeScript("return window.localStorage.clear();");
    };
};

module.exports = new LocalStorage();
