'use strict';

var similars = [];
var images = [];
var types = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var SIMILAR_LENGTH = 8;
var PIN_TEMPLATE = document.querySelector('#pin');
var PIN_BLOCK = PIN_TEMPLATE.content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var ADD_FORM = document.querySelector('.ad-form');
var MAP_FILTER = document.querySelector('.map__filters');
var ADD_FORM_FIELDS = ADD_FORM.children;
var MAP_FILTER_FIELDS = MAP_FILTER.children;
var ADDRESS_FIELD = document.querySelector('#address');
var TYPE_FIELD = document.querySelector('#type');
var PRICE_FIELD = document.querySelector('#price');
var TIMEIN_FIELD = document.querySelector('#timein');
var TIMEOUT_FIELD = document.querySelector('#timeout');
var PIN_MAIN = document.querySelector('.map__pin--main');
var MAP = document.querySelector('.map');
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 81;
var PIN_MAIN_HALF = PIN_MAIN_WIDTH / 2;
var MIN_Y_COORDS = 130;
var MAX_Y_COORDS = 630;
var pageActivated = false;
var RENT_PRICE = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function getAvatar() {
  var random = getRandom(images.length);
  var imageNumber = images.splice(random, 1);
  return 'img/avatars/user0' + imageNumber + '.png';
}

function getType() {
  return types[getRandom(types.length)];
}

function getLocation(direction) {
  if (direction === 'x') {
    return getRandom(MAP.offsetWidth + 1);
  }
  return getRandom(MAX_Y_COORDS - MIN_Y_COORDS) + MIN_Y_COORDS + 1;
}

function createStyle(obj) {
  return 'left: ' + (obj.x - PIN_WIDTH / 2) + 'px; top: ' + (obj.y - PIN_HEIGHT) + 'px;';
}

function createPin(obj) {
  var clonePin = PIN_BLOCK.cloneNode(true);
  var location = obj.location;

  clonePin.setAttribute('style', createStyle(location));
  clonePin.children[0].setAttribute('src', obj.author.avatar);
  clonePin.setAttribute('alt', obj.offer.type);
  fragment.appendChild(clonePin);
}

function deactivateFormsFields() {
  for (var i = 0; i < ADD_FORM_FIELDS.length; i++) {
    ADD_FORM_FIELDS[i].setAttribute('disabled', true);
  }

  for (var k = 0; k < MAP_FILTER_FIELDS.length; k++) {
    MAP_FILTER_FIELDS[k].setAttribute('disabled', true);
  }
}

function activateFormsFields() {
  for (var i = 0; i < ADD_FORM_FIELDS.length; i++) {
    ADD_FORM_FIELDS[i].removeAttribute('disabled');
  }

  for (var k = 0; k < MAP_FILTER_FIELDS.length; k++) {
    MAP_FILTER_FIELDS[k].removeAttribute('disabled');
  }
}

function activatePage() {
  pageActivated = true;
  MAP.classList.remove('map--faded');
  ADD_FORM.classList.remove('ad-form--disabled');
  document.querySelector('.map__pins').appendChild(fragment);
  activateFormsFields();
}

function getMainPinCoords() {
  var coordsPin = PIN_MAIN.getBoundingClientRect();
  var coordsMap = MAP.getBoundingClientRect();
  return {
    x: coordsPin.left - coordsMap.left + PIN_MAIN_HALF,
    y: coordsPin.top - coordsMap.top + PIN_MAIN_HEIGHT
  };
}

function fillAdress(first) {
  var coords = getMainPinCoords();
  if (first) {
    ADDRESS_FIELD.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y - PIN_MAIN_HEIGHT + PIN_MAIN_HALF));
    return;
  }
  ADDRESS_FIELD.setAttribute('value', Math.round(coords.x) + ', ' + Math.round(coords.y));
}

for (var i = 1; i <= SIMILAR_LENGTH; i++) {
  images.push(i);
}

for (var k = 1; k <= SIMILAR_LENGTH; k++) {
  similars.push({
    'author': {
      'avatar': getAvatar(),
    },
    'offer': {
      'type': getType()
    },
    'location': {
      'x': getLocation('x'),
      'y': getLocation('y')
    }
  });
}

for (var j = 1; j <= SIMILAR_LENGTH; j++) {
  createPin(similars[j - 1]);
}

deactivateFormsFields();
fillAdress(true);

TYPE_FIELD.addEventListener('change', function () {
  var price = RENT_PRICE[TYPE_FIELD.value];
  PRICE_FIELD.setAttribute('min', price);
  PRICE_FIELD.setAttribute('placeholder', price);
});

TIMEIN_FIELD.addEventListener('change', function () {
  TIMEOUT_FIELD.value = TIMEIN_FIELD.value;
});

TIMEOUT_FIELD.addEventListener('change', function () {
  TIMEIN_FIELD.value = TIMEOUT_FIELD.value;
});

// ////////////// последнее дз

var pinArrowX = PIN_MAIN.offsetLeft + PIN_MAIN_HALF;
var pinArrowY = PIN_MAIN.offsetTop + PIN_MAIN_HEIGHT;

function overwritePinCoords(x, y) {
  ADDRESS_FIELD.setAttribute('value', Math.round(x) + ', ' + Math.round(y));
}

PIN_MAIN.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  if (!pageActivated) {
    activatePage();
    PIN_MAIN.style.position = 'absolute';
    PIN_MAIN.style.zIndex = 10;
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

    var offsetLeft = PIN_MAIN.offsetLeft - shift.x;
    var offsetTop = PIN_MAIN.offsetTop - shift.y;

    var minOffsetX = 0;
    var maxOffsetX = MAP.offsetWidth - PIN_MAIN_WIDTH;
    var minOffsetY = MIN_Y_COORDS - PIN_MAIN_HEIGHT;
    var maxOffsetY = MAX_Y_COORDS - PIN_MAIN_HEIGHT;

    if (offsetLeft < minOffsetX) {
      offsetLeft = minOffsetX;
    } else if (offsetLeft > maxOffsetX) {
      offsetLeft = maxOffsetX;
    } else if (offsetTop < MIN_Y_COORDS - PIN_MAIN_HEIGHT) {
      offsetTop = minOffsetY;
    } else if (offsetTop > MAX_Y_COORDS - PIN_MAIN_HEIGHT) {
      offsetTop = maxOffsetY;
    }

    pinArrowX = offsetLeft + PIN_MAIN_HALF;
    pinArrowY = offsetTop + PIN_MAIN_HEIGHT;

    PIN_MAIN.style.left = offsetLeft + 'px';
    PIN_MAIN.style.top = offsetTop + 'px';
    overwritePinCoords(pinArrowX, pinArrowY);
  }

  function onMouseUp(upEvt) {
    upEvt.preventDefault();
    overwritePinCoords(pinArrowX, pinArrowY);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});
