'use strict';

var similars = [];
var images = [];
var types = ['palace', 'flat', 'house', 'bungalo'];
var MAX_WIDTH = document.querySelector('.map__pins').offsetWidth;
var MIN_Y_COORDS = 130;
var MAX_Y_COORDS = 630;
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
var ADDRESS = document.querySelector('#address');
var PIN_MAIN = document.querySelector('.map__pin--main');
var MAP = document.querySelector('.map');
var PIN_MAIN_WIDTH = 62;
var PIN_MAIN_HEIGHT = 84;

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
    return getRandom(MAX_WIDTH + 1);
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
  MAP.classList.remove('map--faded');
  ADD_FORM.classList.remove('ad-form--disabled');
  activateFormsFields();
}

function getMainPinCoords() {
  var coordsPin = PIN_MAIN.getBoundingClientRect();
  var coordsMap = MAP.getBoundingClientRect();
  return {
    x: coordsPin.left - coordsMap.left + (PIN_MAIN_WIDTH / 2),
    y: coordsPin.top - coordsMap.top + PIN_MAIN_HEIGHT
  };
}

function fillAdress(first) {
  var coords = getMainPinCoords();
  if (first) {
    ADDRESS.setAttribute('value', coords.x + ' ' + (coords.y - PIN_MAIN_HEIGHT + PIN_MAIN_WIDTH / 2));
    return;
  }
  ADDRESS.setAttribute('value', coords.x + ' ' + coords.y);
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

PIN_MAIN.addEventListener('click', function () {
  activatePage();
  document.querySelector('.map__pins').appendChild(fragment);
  fillAdress();
});
