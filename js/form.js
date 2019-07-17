'use strict';

(function () {
  var addFormFields = window.util.addForm.children;
  var mapFilterFields = window.util.mapFilter.children;
  var typeField = document.querySelector('#type');
  var priceField = document.querySelector('#price');
  var timeInField = document.querySelector('#timein');
  var timeOutField = document.querySelector('#timeout');
  var successTemplate = document.querySelector('#success');
  var successBlock = successTemplate.content.querySelector('.success');
  var roomField = document.querySelector('#room_number');
  var capacityField = document.querySelector('#capacity');
  var capacityOptions = capacityField.querySelectorAll('option');
  var capacitySelectedOption = capacityField.querySelector('option[selected]');
  var resetFormBtn = document.querySelector('.ad-form__reset');
  var RentPrice = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };
  var RoomCapacity = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  function deactivateFormsFields() {
    for (var i = 0; i < addFormFields.length; i++) {
      addFormFields[i].setAttribute('disabled', true);
    }
    for (var k = 0; k < mapFilterFields.length; k++) {
      mapFilterFields[k].setAttribute('disabled', true);
    }
  }

  function activateFormsFields() {
    for (var i = 0; i < addFormFields.length; i++) {
      addFormFields[i].removeAttribute('disabled');
    }
    for (var k = 0; k < mapFilterFields.length; k++) {
      mapFilterFields[k].removeAttribute('disabled');
    }
  }

  function fillAdress(first) {
    var coords = window.map.getMainPinCoords();
    if (first) {
      window.util.addressField.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y - window.util.PIN_MAIN_HEIGHT + window.util.PIN_MAIN_HALF));
      return;
    }
    window.util.addressField.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y));
  }

  typeField.addEventListener('change', function () {
    var price = RentPrice[typeField.value.toUpperCase()];
    priceField.setAttribute('min', price);
    priceField.setAttribute('placeholder', price);
  });

  timeInField.addEventListener('change', function () {
    timeOutField.value = timeInField.value;
  });

  timeOutField.addEventListener('change', function () {
    timeInField.value = timeOutField.value;
  });

  roomField.addEventListener('change', function () {
    var room = roomField.value;
    var capacity = RoomCapacity[room];
    var selected;
    capacityOptions.forEach(function (item) {
      item.removeAttribute('selected');
      item.setAttribute('disabled', '');
      if (capacity.indexOf(item.value) !== -1) {
        item.removeAttribute('disabled');
        selected = item;
      }
    });
    capacityField.value = selected.value;
  });

  deactivateFormsFields();
  fillAdress(true);

  window.util.addForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var url = 'https://js.dump.academy/keksobooking';
    var xhr = new XMLHttpRequest();
    var formData = new FormData(window.util.addForm);
    xhr.responseType = 'json';
    xhr.open('POST', url);
    xhr.addEventListener('load', function () {
      if (xhr.status === window.util.SERVER_VALID_STATUS) {
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

  function reloadPage(popup) {
    var card = document.querySelector('.map__card');
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');

    window.util.addForm.reset();
    window.util.mapFilter.reset();
    priceField.setAttribute('min', RentPrice[typeField.value.toUpperCase()]);
    priceField.setAttribute('placeholder', RentPrice[typeField.value.toUpperCase()]);
    capacityOptions.forEach(function (elem) {
      if (elem !== capacitySelectedOption) {
        elem.removeAttribute('selected');
        elem.setAttribute('disabled', '');
      } else {
        elem.removeAttribute('disabled');
        elem.setAttribute('selected', '');
      }
    });

    if (card) {
      window.util.map.removeChild(card);
    }

    pins.forEach(function (item) {
      window.util.pinsWrapper.removeChild(item);
    });

    window.util.pinMain.style.left = window.map.firstPosition.left;
    window.util.pinMain.style.top = window.map.firstPosition.top;
    window.util.pinMain.style.zIndex = '';
    overwritePinCoords(window.map.firstCoords.x, window.map.firstCoords.y);
    window.util.pageActivated = false;
    window.form.deactivateFormsFields();
    window.util.map.classList.add('map--faded');
    window.util.addForm.classList.add('ad-form--disabled');

    if (popup) {
      var cloneSuccess = successBlock.cloneNode(true);
      window.util.mainBlock.appendChild(cloneSuccess);
      cloneSuccess.addEventListener('click', function () {
        window.util.mainBlock.removeChild(cloneSuccess);
        document.removeEventListener('keydown', keyCloseSuccessHandler);
      });
      document.addEventListener('keydown', keyCloseSuccessHandler);
    }

    function keyCloseSuccessHandler(e) {
      if (window.util.verifyEscKey(e)) {
        window.util.mainBlock.removeChild(cloneSuccess);
        document.removeEventListener('keydown', keyCloseSuccessHandler);
      }
    }
  }

  resetFormBtn.addEventListener('click', function (evt) {
    evt.preventDefault();
    reloadPage();
  });

  function overwritePinCoords(x, y) {
    window.util.addressField.setAttribute('value', Math.round(x) + ', ' + Math.round(y));
  }

  window.form = {
    activateFormsFields: activateFormsFields,
    deactivateFormsFields: deactivateFormsFields,
    overwritePinCoords: overwritePinCoords
  };
})();
