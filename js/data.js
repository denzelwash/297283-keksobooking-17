'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var SIMILARS_LIMITER = 5;
  var pinTemplate = document.querySelector('#pin');
  var pinBlock = pinTemplate.content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card');
  var cardBlock = cardTemplate.content.querySelector('.map__card');
  var errorTemplate = document.querySelector('#error');
  var errorBlock = errorTemplate.content.querySelector('.error');
  var filterBlock = document.querySelector('.map__filters-container');
  var HouseType = {
    FLAT: 'Квартира',
    BUNGALO: 'Бунгало',
    HOUSE: 'Дом',
    PALACE: 'Дворец'
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
      if (similarsFragment.children.length === SIMILARS_LIMITER) {
        break;
      }
      var clonePin = pinBlock.cloneNode(true);
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
    var cloneCard = cardBlock.cloneNode(true);
    var featuresBlock = cloneCard.querySelector('.popup__features');
    var photosBlock = cloneCard.querySelector('.popup__photos');
    var clonePhoto = photosBlock.querySelector('.popup__photo').cloneNode(true);
    var popupAvatar = cloneCard.querySelector('.popup__avatar');

    cloneCard.querySelector('.popup__title').textContent = obj.offer.title;
    cloneCard.querySelector('.popup__text--address').textContent = obj.offer.address;
    cloneCard.querySelector('.popup__text--price').textContent = obj.offer.price + '₽/ночь.';
    cloneCard.querySelector('.popup__type').textContent = HouseType[obj.offer.type.toUpperCase()];
    cloneCard.querySelector('.popup__text--capacity').textContent = obj.offer.rooms + ' комнаты для ' + obj.offer.guests + ' гостей.';
    cloneCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + obj.offer.checkin + ', выезд до ' + obj.offer.checkout + '.';
    cloneCard.querySelector('.popup__description').textContent = obj.offer.description;
    popupAvatar.setAttribute('src', obj.author.avatar);

    featuresBlock.innerHTML = '';
    if (obj.offer.features.length) {
      obj.offer.features.forEach(function (elem) {
        var li = document.createElement('li');
        li.classList.add('popup__feature');
        li.classList.add('popup__feature--' + elem);
        featuresBlock.appendChild(li);
      });
    }

    photosBlock.innerHTML = '';
    if (obj.offer.photos.length) {
      obj.offer.photos.forEach(function (item) {
        var imgTemplate = clonePhoto.cloneNode(true);
        imgTemplate.setAttribute('src', item);
        photosBlock.appendChild(imgTemplate);
      });
    }

    window.util.map.insertBefore(cloneCard, filterBlock);
  }

  function successHandler(similars) {
    window.data.originalSimilarsData = similars;
    createSimilarsFragment(similars);
    window.util.pinsWrapper.appendChild(window.data.similarsFragment);
    window.map.setPinsHandlers();
  }

  function errorHandler() {
    var cloneError = errorBlock.cloneNode(true);
    window.util.mainBlock.appendChild(cloneError);
    cloneError.addEventListener('click', closeErrorHandler);
    document.addEventListener('keydown', keyCloseErrorHandler);

    function closeErrorHandler() {
      window.util.mainBlock.removeChild(cloneError);
      document.removeEventListener('keydown', keyCloseErrorHandler);
    }

    function keyCloseErrorHandler(evt) {
      if (window.util.verifyEscKey(evt)) {
        closeErrorHandler();
      }
    }
  }

  window.data = {
    createSimilarsFragment: createSimilarsFragment,
    createCardFragment: createCardFragment,
    errorHandler: errorHandler,
    successHandler: successHandler
  };

})();
