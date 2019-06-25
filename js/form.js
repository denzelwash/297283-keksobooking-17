'use strict';

(function () {
  var MAP_FILTER = document.querySelector('.map__filters');
  var ADD_FORM_FIELDS = window.util.ADD_FORM.children;
  var MAP_FILTER_FIELDS = MAP_FILTER.children;
  var TYPE_FIELD = document.querySelector('#type');
  var PRICE_FIELD = document.querySelector('#price');
  var TIMEIN_FIELD = document.querySelector('#timein');
  var TIMEOUT_FIELD = document.querySelector('#timeout');
  var RENT_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  function deactivateFormsFields() {
    for (var i = 0; i < ADD_FORM_FIELDS.length; i++) {
      ADD_FORM_FIELDS[i].setAttribute('disabled', true);
    }

    for (var k = 0; k < MAP_FILTER_FIELDS.length; k++) {
      MAP_FILTER_FIELDS[k].setAttribute('disabled', true);
    }
  }

  function activateFormsFields() {
    for (var i = 0; i < ADD_FORM_FIELDS.length; i++) {
      ADD_FORM_FIELDS[i].removeAttribute('disabled');
    }

    for (var k = 0; k < MAP_FILTER_FIELDS.length; k++) {
      MAP_FILTER_FIELDS[k].removeAttribute('disabled');
    }
  }

  function fillAdress(first) {
    var coords = window.map.getMainPinCoords();
    if (first) {
      window.util.ADDRESS_FIELD.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y - window.util.PIN_MAIN_HEIGHT + window.util.PIN_MAIN_HALF));
      return;
    }
    window.util.ADDRESS_FIELD.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y));
  }

  TYPE_FIELD.addEventListener('change', function () {
    var price = RENT_PRICE[TYPE_FIELD.value];
    PRICE_FIELD.setAttribute('min', price);
    PRICE_FIELD.setAttribute('placeholder', price);
  });

  TIMEIN_FIELD.addEventListener('change', function () {
    TIMEOUT_FIELD.value = TIMEIN_FIELD.value;
  });

  TIMEOUT_FIELD.addEventListener('change', function () {
    TIMEIN_FIELD.value = TIMEOUT_FIELD.value;
  });

  deactivateFormsFields();
  fillAdress(true);

  function overwritePinCoords(x, y) {
    window.util.ADDRESS_FIELD.setAttribute('value', Math.round(x) + ', ' + Math.round(y));
  }

  window.form = {
    activateFormsFields: activateFormsFields,
    deactivateFormsFields: deactivateFormsFields,
    overwritePinCoords: overwritePinCoords
  };
})();
