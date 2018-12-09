'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var save = window.backend.save;
  var calculatePosition = window.pin.calculatePosition;

  var mainBlock = document.querySelector('main');

  // Функция, меняет ошибку при попытке отправки заголовка
  var showTitleValidityMessage = function () {
    var noticeTitle = document.querySelector('#title');
    if (noticeTitle.validity.tooShort) {
      noticeTitle.setCustomValidity('Заголовок должен содержать не менее 30-ти символов');
    } else if (noticeTitle.validity.tooLong) {
      noticeTitle.setCustomValidity('Заголовок не должен превышать 100 символов');
    } else if (noticeTitle.validity.valueMissing) {
      noticeTitle.setCustomValidity('Обязательное поле');
    } else {
      noticeTitle.setCustomValidity('');
    }
  };

  // Функция, выводит ошибку при наборе заголовка
  var changeTitleValidityMessage = function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Заголовок должен содержать не менее 30-ти символов! Сейчас символов: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  };

  var showPriceValidityMessage = function () {
    var noticePrice = document.querySelector('#price');
    if (noticePrice.validity.rangeUnderflow) {
      noticePrice.setCustomValidity('Минимальная стоимость: ' + document.querySelector('#price').min);
    } else if (noticePrice.validity.rangeOverflow) {
      noticePrice.setCustomValidity('Кажется, у Вас в стоимости многовато цифр! Максимальная стоимость 1 000 000');
    } else if (noticePrice.validity.valueMissing) {
      noticePrice.setCustomValidity('Обязательное поле');
    } else {
      noticePrice.setCustomValidity('');
    }
  };

  var changePriceValidityMessage = function (evt) {
    var target = evt.target;
    if (target.value < 1000) {
      target.setCustomValidity('Настолько дешёвого жилья не бывает! Накиньте еще ' + (1000 - target.value));
    } else {
      target.setCustomValidity('');
    }
  };

  var changeRoomsBlock = function () {
    var rooms = document.querySelector('#room_number');
    var guests = document.querySelector('#capacity');
    guests.value = '';

    if (rooms.value === '100') {
      guests.querySelectorAll('option').forEach(function (elem) {
        elem.disabled = (elem.value === '0') ? false : true;
      });
    } else {
      guests.querySelectorAll('option').forEach(function (elem) {
        elem.disabled = (elem.value <= rooms.value) ? false : true;
      });
      guests.querySelector('[value="0"]').disabled = true;
    }
  };

  var watchTypeNotice = function () {
    var type = document.querySelector('#type');
    var price = document.querySelector('#price');

    if (type.value === 'bungalo') {
      price.min = 0;
      price.placeholder = 0;
    } else if (type.value === 'flat') {
      price.min = 1000;
      price.placeholder = 1000;
    } else if (type.value === 'house') {
      price.min = 5000;
      price.placeholder = 5000;
    } else if (type.value === 'palace') {
      price.min = 10000;
      price.placeholder = 10000;
    }
  };

  var watchTimeIn = function () {
    var timeIn = document.querySelector('#timein');
    var timeOut = document.querySelector('#timeout');

    if (timeIn.value) {
      timeOut.value = timeIn.value;
    }
  };

  var watchTimeOut = function () {
    var timeIn = document.querySelector('#timein');
    var timeOut = document.querySelector('#timeout');

    if (timeOut.value) {
      timeIn.value = timeOut.value;
    }
  };

  var activateForm = function () {
    document.querySelector('#title').addEventListener('invalid', showTitleValidityMessage);
    document.querySelector('#title').addEventListener('input', changeTitleValidityMessage);
    document.querySelector('#price').addEventListener('invalid', showPriceValidityMessage);
    document.querySelector('#price').addEventListener('input', changePriceValidityMessage);
    document.querySelector('#room_number').addEventListener('input', changeRoomsBlock);
    document.querySelector('#type').addEventListener('input', watchTypeNotice);
    document.querySelector('#timein').addEventListener('input', watchTimeIn);
    document.querySelector('#timeout').addEventListener('input', watchTimeOut);
  };

  var deactivateForm = function () {
    document.querySelector('#title').removeEventListener('invalid', showTitleValidityMessage);
    document.querySelector('#title').removeEventListener('input', changeTitleValidityMessage);
    document.querySelector('#price').removeEventListener('invalid', showPriceValidityMessage);
    document.querySelector('#price').removeEventListener('input', changePriceValidityMessage);
    document.querySelector('#room_number').removeEventListener('input', changeRoomsBlock);
    document.querySelector('#type').removeEventListener('input', watchTypeNotice);
    document.querySelector('#timein').removeEventListener('input', watchTimeIn);
    document.querySelector('#timeout').removeEventListener('input', watchTimeOut);
  };

  var showError = function (errorText) {
    var errorElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
    var errorMessage = document.createElement('p');

    errorMessage.textContent = errorText;
    errorMessage.style.color = 'white';

    errorElement.insertBefore(errorMessage, errorElement.querySelector('.error__button'));
    mainBlock.appendChild(errorElement);
  };

  var showSuccess = function () {
    var successElement = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

    mainBlock.appendChild(successElement);
    setTimeout(removeSuccess, 2000);
  };

  var removeSuccess = function () {
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

  window.form = {
    adForm: adForm,
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    showError: showError
  };

})();
