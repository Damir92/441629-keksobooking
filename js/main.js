'use strict';

(function () {

  var ESC_KEYCODE = window.data.ESC_KEYCODE;
  var adForm = window.map.adForm;
  var resetPage = window.map.resetPage;
  var save = window.backend.save;
  var calculatePosition = window.pin.calculatePosition;

  var mainBlock = document.querySelector('main');

  var showError = function (errorText) {
    var errorElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var errorMessage = document.createElement('p');

    errorMessage.textContent = errorText;
    errorMessage.style.color = 'white';

    errorElement.insertBefore(errorMessage, errorElement.querySelector('.error__button'));
    mainBlock.appendChild(errorElement);

    window.addEventListener('click', onErrorWindowClick);
    window.addEventListener('keydown', onMessageEscPress);
  };

  var removeError = function () {
    window.removeEventListener('click', onErrorWindowClick);
    window.removeEventListener('keydown', onMessageEscPress);

    mainBlock.removeChild(mainBlock.querySelector('.error'));
  };

  var onErrorWindowClick = function () {
    removeError();
  };

  var onSuccessWindowClick = function () {
    removeSuccess();
  };

  var onMessageEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (mainBlock.querySelector('.error')) {
        removeError();
      } else if (mainBlock.querySelector('.success')) {
        removeSuccess();
      }
    }
  };

  var showSuccess = function () {
    var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

    resetPage();
    mainBlock.appendChild(successElement);

    window.addEventListener('click', onSuccessWindowClick);
    window.addEventListener('keydown', onMessageEscPress);
  };

  var removeSuccess = function () {
    window.removeEventListener('click', onSuccessWindowClick);
    window.removeEventListener('keydown', onMessageEscPress);

    mainBlock.removeChild(mainBlock.querySelector('.success'));
  };

  adForm.addEventListener('submit', function (evt) {
    save(new FormData(adForm), function () {
      showSuccess();

      adForm.reset();
      calculatePosition(document.querySelector('.map__pin--main'));
    }, function (errorText) {
      showError(errorText);
    });
    evt.preventDefault();
  });

})();
