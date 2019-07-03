'use strict';

(function () {
  window.util = {
    MIN_Y_COORDS: 130,
    MAX_Y_COORDS: 630,
    MAP: document.querySelector('.map'),
    PINS_WRAPPER: document.querySelector('.map__pins'),
    PIN_MAIN: document.querySelector('.map__pin--main'),
    PIN_MAIN_WIDTH: 65,
    PIN_MAIN_HEIGHT: 81,
    ADDRESS_FIELD: document.querySelector('#address'),
    ADD_FORM: document.querySelector('.ad-form'),
    pageActivated: false,
    MAIN_BLOCK: document.querySelector('main'),
    getRandom: function (max) {
      return Math.floor(Math.random() * max);
    }
  };
  window.util.PIN_MAIN_HALF = window.util.PIN_MAIN_WIDTH / 2;
})();
