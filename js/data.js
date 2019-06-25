'use strict';

(function () {
  var similars = [];
  var images = [];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var SIMILAR_LENGTH = 8;
  var PIN_TEMPLATE = document.querySelector('#pin');
  var PIN_BLOCK = PIN_TEMPLATE.content.querySelector('.map__pin');
  var similarsFragment = document.createDocumentFragment();

  function getAvatar() {
    var random = window.util.getRandom(images.length);
    var imageNumber = images.splice(random, 1);
    return 'img/avatars/user0' + imageNumber + '.png';
  }

  function getType() {
    return types[window.util.getRandom(types.length)];
  }

  function getLocation(direction) {
    if (direction === 'x') {
      return window.util.getRandom(window.util.MAP.offsetWidth + 1);
    }
    return window.util.getRandom(window.util.MAX_Y_COORDS - window.util.MIN_Y_COORDS) + window.util.MIN_Y_COORDS + 1;
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
    similarsFragment.appendChild(clonePin);
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

  window.data = {
    similarsFragment: similarsFragment
  };
})();
