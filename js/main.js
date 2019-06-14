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

document.querySelector('.map').classList.remove('map--faded');

for (var j = 1; j <= SIMILAR_LENGTH; j++) {
  createPin(similars[j - 1]);
}

document.querySelector('.map__pins').appendChild(fragment);
