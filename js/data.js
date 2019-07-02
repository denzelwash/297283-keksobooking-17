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

  function successHandler(similars) {
    for (var i = 0; i < similars.length; i++) {
      if (!similars[i].offer) {
        continue;
      }
      var clonePin = PIN_BLOCK.cloneNode(true);
      var pinImg = clonePin.children[0];
      var location = similars[i].location;
      clonePin.setAttribute('style', createStyle(location));
      pinImg.setAttribute('src', similars[i].author.avatar);
      pinImg.setAttribute('alt', similars[i].offer.type);
      similarsFragment.appendChild(clonePin);
    }
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
    similarsFragment: similarsFragment
  };
})();
