'use strict';

(function () {
  var MAP_FILTER = document.querySelector('.map__filters');
  var ADD_FORM_FIELDS = window.util.ADD_FORM.children;
  var MAP_FILTER_FIELDS = MAP_FILTER.children;
  var TYPE_FIELD = document.querySelector('#type');
  var PRICE_FIELD = document.querySelector('#price');
  var TIMEIN_FIELD = document.querySelector('#timein');
  var TIMEOUT_FIELD = document.querySelector('#timeout');
  var SUCCESS_TEMPLATE = document.querySelector('#success');
  var SUCCESS_BLOCK = SUCCESS_TEMPLATE.content.querySelector('.success');
  var ROOM_FIELD = document.querySelector('#room_number');
  var CAPACITY_FIELD = document.querySelector('#capacity');
  var CAPACITY_OPTIONS = CAPACITY_FIELD.querySelectorAll('option');
  var RESET_FORM_BTN = document.querySelector('.ad-form__reset');
  var RENT_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var ROOM_CAPACITY = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
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

  ROOM_FIELD.addEventListener('change', function () {
    var room = ROOM_FIELD.value;
    var capacity = ROOM_CAPACITY[room];
    var selected;
    CAPACITY_OPTIONS.forEach(function (item) {
      item.removeAttribute('selected');
      item.setAttribute('disabled', '');
      if (capacity.indexOf(item.value) !== -1) {
        item.removeAttribute('disabled');
        selected = item;
      }
    });
    selected.setAttribute('selected', '');
  });

  deactivateFormsFields();
  fillAdress(true);

  window.util.ADD_FORM.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var URL = 'https://js.dump.academy/keksobooking';
    var xhr = new XMLHttpRequest();
    var formData = new FormData(window.util.ADD_FORM);
    xhr.responseType = 'json';
    xhr.open('POST', URL);
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        reloadPage(true);
      } else {
        window.data.errorHandler();
      }
    });
    xhr.addEventListener('error', function () {
      window.data.errorHandler();
    });
    xhr.send(formData);
  });

  function reloadPage(showPopup) {
    var card = document.querySelector('.map__card');
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    window.util.ADD_FORM.reset();
    MAP_FILTER.reset();

    if (card) {
      window.util.MAP.removeChild(card);
    }

    pins.forEach(function (item) {
      window.util.PINS_WRAPPER.removeChild(item);
    });

    window.util.PIN_MAIN.style.left = window.map.FIRST_POSITION.left;
    window.util.PIN_MAIN.style.top = window.map.FIRST_POSITION.top;
    window.util.PIN_MAIN.style.zIndex = '';
    overwritePinCoords(window.map.FIRST_COORDS.x, window.map.FIRST_COORDS.y);
    window.util.pageActivated = false;
    window.data.createSimilarsFragment(window.data.originalSimilarsData);
    window.form.deactivateFormsFields();
    window.util.MAP.classList.add('map--faded');
    window.util.ADD_FORM.classList.add('ad-form--disabled');

    if (showPopup) {
      var cloneSuccess = SUCCESS_BLOCK.cloneNode(true);
      window.util.MAIN_BLOCK.appendChild(cloneSuccess);
      cloneSuccess.addEventListener('click', function () {
        window.util.MAIN_BLOCK.removeChild(cloneSuccess);
        document.removeEventListener('keydown', keyCloseSuccessHandler);
      });
      document.addEventListener('keydown', keyCloseSuccessHandler);
    }
    function keyCloseSuccessHandler(e) {
      if (e.keyCode === 27) {
        window.util.MAIN_BLOCK.removeChild(cloneSuccess);
        document.removeEventListener('keydown', keyCloseSuccessHandler);
      }
    }
  }

  RESET_FORM_BTN.addEventListener('click', function (evt) {
    evt.preventDefault();
    reloadPage();
  });

  function overwritePinCoords(x, y) {
    window.util.ADDRESS_FIELD.setAttribute('value', Math.round(x) + ', ' + Math.round(y));
  }

  window.form = {
    activateFormsFields: activateFormsFields,
    deactivateFormsFields: deactivateFormsFields,
    overwritePinCoords: overwritePinCoords
  };
})();
