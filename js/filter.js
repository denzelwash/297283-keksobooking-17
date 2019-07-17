'use strict';

(function () {
  var FILTER_DELAY = 500;
  var mapTypeFilter = document.querySelector('#housing-type');
  var mapPriceFilter = document.querySelector('#housing-price');
  var mapRoomsFilter = document.querySelector('#housing-rooms');
  var mapGuestsFilter = document.querySelector('#housing-guests');
  var mapFeaturesFilter = window.util.mapFilter.querySelector('.map__features');
  var mapFeaturesItems = mapFeaturesFilter.querySelectorAll('input[type=checkbox]');
  var lastTimeout;
  var MapPrice = {
    MIDDLE: [10000, 50000],
    LOW: [0, 10000],
    HIGH: [50000, Infinity]
  };
  window.filter = {};

  function runFilter() {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var card = document.querySelector('.map__card');
    var featuresValues = [].slice.call(mapFeaturesItems).filter(function (item) {
      return (item.checked === true);
    });
    var filterObj = {
      type: mapTypeFilter.value,
      price: mapPriceFilter.value,
      rooms: mapRoomsFilter.value,
      guests: mapGuestsFilter.value,
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
      if (filterObj.price && !(MapPrice[filterObj.price.toUpperCase()][0] <= offer.price && offer.price <= MapPrice[filterObj.price.toUpperCase()][1])) {
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
      window.util.pinsWrapper.removeChild(item);
    });

    if (card) {
      window.util.map.removeChild(card);
    }

    window.data.createSimilarsFragment(filteredPins);
    window.util.pinsWrapper.appendChild(window.data.similarsFragment);
    window.map.setPinsHandlers();
  }

  window.util.mapFilter.addEventListener('change', function (evt) {
    if (evt.target.tagName === 'SELECT') {
      debounce(runFilter);
    }
  });

  mapFeaturesFilter.addEventListener('click', function (evt) {
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
