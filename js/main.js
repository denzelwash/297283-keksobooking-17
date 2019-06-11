'use strict';

var similarArray = [];
var imagesArray = [];
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

function setAvatar() {
  var random = getRandom(imagesArray.length);
  var imageNumber = imagesArray.splice(random, 1);
  return '0' + imageNumber;
}

function setType() {
  return types[getRandom(types.length)];
}

function setLocation(direction) {
  if (direction === 'x') {
    return getRandom(MAX_WIDTH + 1);
  } else {
    return getRandom(MAX_Y_COORDS - MIN_Y_COORDS) + MIN_Y_COORDS + 1;
  }
}

function createPin(obj) {
  var clonePin = PIN_BLOCK.cloneNode(true);
  var stylePin = 'left: ' + (obj.location.x - PIN_WIDTH / 2) + 'px; top: ' + (obj.location.y - PIN_HEIGHT) + 'px;';

  clonePin.setAttribute('style', stylePin);
  clonePin.children[0].setAttribute('src', obj.author.avatar);
  clonePin.setAttribute('alt', obj.offer.type);
  fragment.appendChild(clonePin);
}

for (var i = 1; i <= SIMILAR_LENGTH; i++) {
  imagesArray.push(i);
}

for (var k = 1; k <= SIMILAR_LENGTH; k++) {
  similarArray.push({
    'author': {
      'avatar': 'img/avatars/user' + setAvatar() + '.png',
    },
    'offer': {
      'type': setType()
    },
    'location': {
      'x': setLocation('x'),
      'y': setLocation('y')
    }
  });
}

document.querySelector('.map').classList.remove('map--faded');

for (var j = 1; j <= SIMILAR_LENGTH; j++) {
  createPin(similarArray[j - 1]);
}

document.querySelector('.map__pins').appendChild(fragment);
