'use strict';

(function () {
  function activatePage() {
    window.util.pageActivated = true;
    window.util.MAP.classList.remove('map--faded');
    window.util.ADD_FORM.classList.remove('ad-form--disabled');
    window.util.PINS_WRAPPER.appendChild(window.data.similarsFragment);
    window.form.activateFormsFields();
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
    if (!window.util.pageActivated) {
      activatePage();
      window.util.PIN_MAIN.style.position = 'absolute';
      window.util.PIN_MAIN.style.zIndex = 10;
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

  window.map = {
    getMainPinCoords: getMainPinCoords
  };
})();
