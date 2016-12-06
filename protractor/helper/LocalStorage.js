"use strict";

var LocalStorage = function () {
    this.getValue = function (key) {
        return browser.executeScript("return window.localStorage.getItem('" + key + "');");
    };

    this.setValue = function (key) {
      return browser.executeScript("window.localStorage.setItem('playerStoredITE','" + key + "');");
    };
    
    this.clear = function () {
        browser.executeScript("return window.localStorage.clear();");
    };
};

module.exports = new LocalStorage();