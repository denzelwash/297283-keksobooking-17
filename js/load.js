'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  function load(onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.util.SERVER_VALID_STATUS) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });

    xhr.open('GET', URL);
    xhr.send();
  }

  window.load = load;

})();
