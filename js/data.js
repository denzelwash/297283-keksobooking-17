'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var PIN_TEMPLATE = document.querySelector('#pin');
  var PIN_BLOCK = PIN_TEMPLATE.content.querySelector('.map__pin');
  var CARD_TEMPLATE = document.querySelector('#card');
  var CARD_BLOCK = CARD_TEMPLATE.content.querySelector('.map__card');
  var FILTER_BLOCK = document.querySelector('.map__filters-container');
  var ERROR_TEMPLATE = document.querySelector('#error');
  var ERROR_BLOCK = ERROR_TEMPLATE.content.querySelector('.error');
  var HOUSE_TYPE = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  function createStyle(obj) {
    return 'left: ' + (obj.x - PIN_WIDTH / 2) + 'px; top: ' + (obj.y - PIN_HEIGHT) + 'px;';
  }

  function createSimilarsFragment(similars) {
    var similarsFragment = document.createDocumentFragment();
    var similarsNewData = [];

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
      similarsNewData.push(similar);
      clonePin.setAttribute('style', createStyle(location));
      pinImg.setAttribute('src', similar.author.avatar);
      pinImg.setAttribute('alt', similar.offer.type);
      similarsFragment.appendChild(clonePin);
    }

    window.data.similarsNewData = similarsNewData;
    window.data.similarsFragment = similarsFragment;
  }

  function createCardFragment(obj) {
    var cloneCard = CARD_BLOCK.cloneNode(true);
    var FEATURES_BLOCK = cloneCard.querySelector('.popup__features');
    var PHOTOS_BLOCK = cloneCard.querySelector('.popup__photos');
    var CLONE_PHOTO = PHOTOS_BLOCK.querySelector('.popup__photo').cloneNode(true);
    var POPUP_AVATAR = cloneCard.querySelector('.popup__avatar');

    cloneCard.querySelector('.popup__title').textContent = obj.offer.title;
    cloneCard.querySelector('.popup__text--address').textContent = obj.offer.address;
    cloneCard.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь.';
    cloneCard.querySelector('.popup__type').textContent = HOUSE_TYPE[obj.offer.type];
    cloneCard.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей.';
    cloneCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout + '.';
    cloneCard.querySelector('.popup__description').textContent = obj.offer.description;
    POPUP_AVATAR.setAttribute('src', obj.author.avatar);

    FEATURES_BLOCK.innerHTML = '';
    if (obj.offer.features.length) {
      obj.offer.features.forEach(function (elem) {
        var li = document.createElement('li');
        li.classList.add('popup__feature');
        li.classList.add('popup__feature--' + elem);
        FEATURES_BLOCK.appendChild(li);
      });
    }

    PHOTOS_BLOCK.innerHTML = '';
    if (obj.offer.photos.length) {
      obj.offer.photos.forEach(function (item) {
        var IMG_TEMPLATE = CLONE_PHOTO.cloneNode(true);
        IMG_TEMPLATE.setAttribute('src', item);
        PHOTOS_BLOCK.appendChild(IMG_TEMPLATE);
      });
    }

    window.util.MAP.insertBefore(cloneCard, FILTER_BLOCK);
  }

  function successHandler(similars) {
    window.data.originalSimilarsData = similars;
    createSimilarsFragment(similars);
  }

  function errorHandler() {
    var cloneError = ERROR_BLOCK.cloneNode(true);
    var errorButton = cloneError.querySelector('.error__button');

    window.util.MAIN_BLOCK.appendChild(cloneError);
    errorButton.addEventListener('click', closeErrorHandler);
    cloneError.addEventListener('click', closeErrorHandler);
    document.addEventListener('keydown', keyCloseErrorHandler);

    function closeErrorHandler() {
      window.util.MAIN_BLOCK.removeChild(cloneError);
      document.removeEventListener('keydown', keyCloseErrorHandler);
    }

    function keyCloseErrorHandler(evt) {
      if (evt.keyCode === 27) {
        closeErrorHandler();
      }
    }
  }

  window.load(successHandler, errorHandler);

  window.data = {
    createSimilarsFragment: createSimilarsFragment,
    createCardFragment: createCardFragment,
    errorHandler: errorHandler
  };

})();
