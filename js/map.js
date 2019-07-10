'use strict';

(function () {
  window.map = {};
  var firstActivate = false;

  function activatePage() {
    window.util.MAP.classList.remove('map--faded');
    window.util.ADD_FORM.classList.remove('ad-form--disabled');
    window.util.PINS_WRAPPER.appendChild(window.data.similarsFragment);
    if (!firstActivate) {
      var FIRST_ADDRESS_VALUE = window.util.ADDRESS_FIELD.getAttribute('value').split(',');
      window.map.FIRST_COORDS = {
        x: +FIRST_ADDRESS_VALUE[0],
        y: Math.floor(+FIRST_ADDRESS_VALUE[1] + window.util.PIN_MAIN_HALF + window.util.PIN_ARROW_HEIGHT)
      };
      window.map.FIRST_POSITION = {
        left: window.util.PIN_MAIN.style.left,
        top: window.util.PIN_MAIN.style.top,
      };
      firstActivate = true;
    }
    window.form.activateFormsFields();
    window.util.pageActivated = true;
    setPinsHandlers();
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
        window.util.MAP.removeChild(oldCard);
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

    function closePopup(card, pin) {
      window.util.MAP.removeChild(card);
      pin.classList.remove('map__pin--active');
    }

    window.map.closePopup = closePopup;
  }

  function getMainPinCoords() {
    var coordsPin = window.util.PIN_MAIN.getBoundingClientRect();
    var coordsMap = window.util.MAP.getBoundingClientRect();
    return {
      x: coordsPin.left - coordsMap.left + window.util.PIN_MAIN_HALF,
      y: coordsPin.top - coordsMap.top + window.util.PIN_MAIN_HEIGHT
    };
  }

  var pinArrowX = window.util.PIN_MAIN.offsetLeft + window.util.PIN_MAIN_HALF;
  var pinArrowY = window.util.PIN_MAIN.offsetTop + window.util.PIN_MAIN_HEIGHT;

  window.util.PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    window.util.PIN_MAIN.style.position = 'absolute';
    window.util.PIN_MAIN.style.zIndex = 10;
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

      var offsetLeft = window.util.PIN_MAIN.offsetLeft - shift.x;
      var offsetTop = window.util.PIN_MAIN.offsetTop - shift.y;

      var minOffsetX = 0;
      var maxOffsetX = window.util.MAP.offsetWidth - window.util.PIN_MAIN_WIDTH;
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

      window.util.PIN_MAIN.style.left = offsetLeft + 'px';
      window.util.PIN_MAIN.style.top = offsetTop + 'px';
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
      window.map.closePopup(card, activePin);
    }
  });

  window.map.getMainPinCoords = getMainPinCoords;
  window.map.setPinsHandlers = setPinsHandlers;
})();
