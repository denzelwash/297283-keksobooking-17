'use strict';

(function () {
  var MAP_TYPE_FILTER = document.querySelector('#housing-type');
  var MAP_PRICE_FILTER = document.querySelector('#housing-price');
  var MAP_ROOMS_FILTER = document.querySelector('#housing-rooms');
  var MAP_GUESTS_FILTER = document.querySelector('#housing-guests');
  var MAP_FEATURES_FILTER = window.util.MAP_FILTER.querySelector('.map__features');
  var MAP_FUATURES_ITEMS = MAP_FEATURES_FILTER.querySelectorAll('input[type=checkbox]');
  var lastTimeout;
  var FILTER_DELAY = 500;
  var MAP_PRICE_VALUE = {
    middle: [10000, 50000],
    low: [0, 10000],
    high: [50000, Infinity]
  };
  window.filter = {};

  function runFilter() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var card = document.querySelector('.map__card');
    var featuresValues = [].slice.call(MAP_FUATURES_ITEMS).filter(function (item) {
      return (item.checked === true);
    });
    var filterObj = {
      type: MAP_TYPE_FILTER.value,
      price: MAP_PRICE_FILTER.value,
      rooms: MAP_ROOMS_FILTER.value,
      guests: MAP_GUESTS_FILTER.value,
      features: featuresValues.map(function (item) {
        return item.value;
      })
    };

    for (var key in filterObj) {
      if (filterObj[key] === 'any') {
        delete filterObj[key];
      }
    }

    var filteredPins = window.data.originalSimilarsData.filter(function (item) {
      var offer = item.offer;

      if (filterObj.type && filterObj.type !== offer.type) {
        return false;
      }
      if (filterObj.price && !(MAP_PRICE_VALUE[filterObj.price][0] <= offer.price && offer.price <= MAP_PRICE_VALUE[filterObj.price][1])) {
        return false;
      }
      if (filterObj.rooms && +filterObj.rooms !== offer.rooms) {
        return false;
      }
      if (filterObj.guests && +filterObj.guests !== offer.guests) {
        return false;
      }
      if (filterObj.features.length) {
        return filterObj.features.every(function (elem) {
          return (offer.features.indexOf(elem) !== -1);
        });
      }

      return true;
    });

    pins.forEach(function (item) {
      window.util.PINS_WRAPPER.removeChild(item);
    });

    if (card) {
      window.util.MAP.removeChild(card);
    }

    window.data.createSimilarsFragment(filteredPins);
    window.util.PINS_WRAPPER.appendChild(window.data.similarsFragment);
    window.map.setPinsHandlers();
  }

  window.util.MAP_FILTER.addEventListener('change', function (evt) {
    if (evt.target.tagName === 'SELECT') {
      debounce(runFilter);
    }
  });

  MAP_FEATURES_FILTER.addEventListener('click', function (evt) {
    if (evt.target.tagName === 'INPUT') {
      debounce(runFilter);
    }
  });

  function debounce(func) {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(func, FILTER_DELAY);
  }

})();
