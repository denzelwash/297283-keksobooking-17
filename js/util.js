'use strict';

(function () {
  window.util = {
    MIN_Y_COORDS: 130,
    MAX_Y_COORDS: 630,
    PIN_MAIN_WIDTH: 65,
    PIN_MAIN_HEIGHT: 81,
    SERVER_VALID_STATUS: 200,
    map: document.querySelector('.map'),
    mapFilter: document.querySelector('.map__filters'),
    pinsWrapper: document.querySelector('.map__pins'),
    pinMain: document.querySelector('.map__pin--main'),
    addressField: document.querySelector('#address'),
    addForm: document.querySelector('.ad-form'),
    mainBlock: document.querySelector('main'),
    pageActivated: false,
    verifyEscKey: function (e) {
      if (e.keyCode === 27) {
        return true;
      }
      return false;
    },
    getRandom: function (max) {
      return Math.floor(Math.random() * max);
    }
  };
  window.util.PIN_MAIN_HALF = window.util.PIN_MAIN_WIDTH / 2;
  window.util.PIN_ARROW_HEIGHT = window.util.PIN_MAIN_HEIGHT - window.util.PIN_MAIN_WIDTH;
})();
