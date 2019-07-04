'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_TEMPLATE = document.querySelector('#pin');
  var PIN_BLOCK = PIN_TEMPLATE.content.querySelector('.map__pin');
  var ERROR_TEMPLATE = document.querySelector('#error');
  var ERROR_BLOCK = ERROR_TEMPLATE.content.querySelector('.error');
  var similarsFragment = document.createDocumentFragment();

  function createStyle(obj) {
    return 'left: ' + (obj.x - PIN_WIDTH / 2) + 'px; top: ' + (obj.y - PIN_HEIGHT) + 'px;';
  }

  function createSimilarsFragment(similars) {
    for (var i = 0; i < similars.length; i++) {
      var similar = similars[i];
      if (!similar.offer) {
        continue;
      }
      if (similarsFragment.children.length === 5) {
        break;
      }
      var clonePin = PIN_BLOCK.cloneNode(true);
      var pinImg = clonePin.children[0];
      var location = similar.location;
      clonePin.setAttribute('style', createStyle(location));
      pinImg.setAttribute('src', similar.author.avatar);
      pinImg.setAttribute('alt', similar.offer.type);
      similarsFragment.appendChild(clonePin);
    }
  }

  function successHandler(similars) {
    window.data.originalSimilarsData = similars;
    createSimilarsFragment(similars);
  }

  function errorHandler() {
    var cloneError = ERROR_BLOCK.cloneNode(true);
    var errorButton = cloneError.querySelector('.error__button');
    window.util.MAIN_BLOCK.appendChild(cloneError);
    errorButton.addEventListener('click', function () {
      window.location.reload();
    });
  }

  window.load(successHandler, errorHandler);

  window.data = {
    similarsFragment: similarsFragment,
    createSimilarsFragment: createSimilarsFragment
  };

})();
