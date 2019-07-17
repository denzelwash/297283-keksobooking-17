'use strict';

(function () {
  window.map = {};
  var firstActivate = false;

  function activatePage() {
    var firstAddressValue = window.util.addressField.getAttribute('value').split(',');
    window.load(window.data.successHandler, window.data.errorHandler);
    window.util.map.classList.remove('map--faded');
    window.util.addForm.classList.remove('ad-form--disabled');

    if (!firstActivate) {
      window.map.firstCoords = {
        x: +firstAddressValue[0],
        y: Math.floor(+firstAddressValue[1] + window.util.PIN_MAIN_HALF + window.util.PIN_ARROW_HEIGHT)
      };
      window.map.firstPosition = {
        left: window.util.pinMain.style.left,
        top: window.util.pinMain.style.top,
      };
      firstActivate = true;
    }

    window.form.activateFormsFields();
    window.util.pageActivated = true;
  }

  function setPinsHandlers() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (elem, index) {
      setHandler(elem, index);
    });
  }

  function setHandler(elem, index) {
    elem.addEventListener('click', function () {
      if (elem.classList.contains('map__pin--active')) {
        return;
      }

      var oldCard = document.querySelector('.map__card');
      var activePin = document.querySelector('.map__pin--active');

      if (oldCard) {
        window.util.map.removeChild(oldCard);
      }
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }

      elem.classList.add('map__pin--active');
      window.data.createCardFragment(window.data.similarsNewData[index]);

      var newCard = document.querySelector('.map__card');
      var closeButton = newCard.querySelector('.popup__close');
      closeButton.addEventListener('click', function () {
        closePopup(newCard, elem);
      });

    });
  }

  function closePopup(card, pin) {
    window.util.map.removeChild(card);
    pin.classList.remove('map__pin--active');
  }

  function getMainPinCoords() {
    var coordsPin = window.util.pinMain.getBoundingClientRect();
    var coordsMap = window.util.map.getBoundingClientRect();
    return {
      x: coordsPin.left - coordsMap.left + window.util.PIN_MAIN_HALF,
      y: coordsPin.top - coordsMap.top + window.util.PIN_MAIN_HEIGHT
    };
  }

  var pinArrowX = window.util.pinMain.offsetLeft + window.util.PIN_MAIN_HALF;
  var pinArrowY = window.util.pinMain.offsetTop + window.util.PIN_MAIN_HEIGHT;

  window.util.pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    window.util.pinMain.style.position = 'absolute';
    window.util.pinMain.style.zIndex = 10;
    if (!window.util.pageActivated) {
      activatePage();
    }
    var coords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: coords.x - moveEvt.clientX,
        y: coords.y - moveEvt.clientY
      };
      coords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var offsetLeft = window.util.pinMain.offsetLeft - shift.x;
      var offsetTop = window.util.pinMain.offsetTop - shift.y;

      var minOffsetX = 0;
      var maxOffsetX = window.util.map.offsetWidth - window.util.PIN_MAIN_WIDTH;
      var minOffsetY = window.util.MIN_Y_COORDS - window.util.PIN_MAIN_HEIGHT;
      var maxOffsetY = window.util.MAX_Y_COORDS - window.util.PIN_MAIN_HEIGHT;

      if (offsetLeft < minOffsetX) {
        offsetLeft = minOffsetX;
      } else if (offsetLeft > maxOffsetX) {
        offsetLeft = maxOffsetX;
      } else if (offsetTop < window.util.MIN_Y_COORDS - window.util.PIN_MAIN_HEIGHT) {
        offsetTop = minOffsetY;
      } else if (offsetTop > window.util.MAX_Y_COORDS - window.util.PIN_MAIN_HEIGHT) {
        offsetTop = maxOffsetY;
      }

      pinArrowX = offsetLeft + window.util.PIN_MAIN_HALF;
      pinArrowY = offsetTop + window.util.PIN_MAIN_HEIGHT;

      window.util.pinMain.style.left = offsetLeft + 'px';
      window.util.pinMain.style.top = offsetTop + 'px';
      window.form.overwritePinCoords(pinArrowX, pinArrowY);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();
      window.form.overwritePinCoords(pinArrowX, pinArrowY);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  document.addEventListener('keydown', function (e) {
    if (e.keyCode !== 27) {
      return;
    }
    var card = document.querySelector('.map__card');
    var activePin = document.querySelector('.map__pin--active');
    if (!!card && !!activePin) {
      closePopup(card, activePin);
    }
  });

  window.map = {
    getMainPinCoords: getMainPinCoords,
    setPinsHandlers: setPinsHandlers
  };

})();
