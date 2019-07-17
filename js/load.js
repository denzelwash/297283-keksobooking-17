'use strict';

(function () {
  function load(onSuccess, onError) {
    var url = 'https://js.dump.academy/keksobooking/data';
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

    xhr.open('GET', url);
    xhr.send();
  }

  window.load = load;
})();
