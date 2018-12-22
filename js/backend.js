'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var URL_DATA = 'https://js.dump.academy/keksobooking/data';
  var TIMEOUT = 10000;
  var SUCCESS_STATUS = 200;

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    makeXhr(xhr, onLoad, onError);

    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    makeXhr(xhr, onLoad, onError);

    xhr.open('POST', URL);
    xhr.send(data);
  };

  var makeXhr = function (xhr, onLoad, onError) {
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Ошибка! Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
  };

  window.backend = {
    load: load,
    save: save
  };

})();
