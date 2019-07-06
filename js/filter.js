'use strict';

(function () {
  var MAP_TYPE_FILTER = document.querySelector('#housing-type');
  window.filter = {};

  MAP_TYPE_FILTER.addEventListener('change', function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var newData = window.data.originalSimilarsData.filter(function (item) {
      return item.offer.type === MAP_TYPE_FILTER.value;
    });

    pins.forEach(function (item) {
      window.util.PINS_WRAPPER.removeChild(item);
    });

    if (MAP_TYPE_FILTER.value === 'any') {
      window.data.createSimilarsFragment(window.data.originalSimilarsData);
    } else {
      window.data.createSimilarsFragment(newData);
    }

    window.util.PINS_WRAPPER.appendChild(window.data.similarsFragment);
    window.filter.newData = newData;
    // console.log(window.filter.newData);
  });

})();
