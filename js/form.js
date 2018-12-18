'use strict';

(function () {

  var typeApartmentMap = window.data.typeApartmentMap;
  var capacityApartmentMap = window.data.capacityApartmentMap;

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

    guests.querySelectorAll('option').forEach(function (elem) {
      elem.disabled = true;
    });

    capacityApartmentMap[rooms.value].forEach(function (elem) {
      guests.querySelector('[value="' + elem + '"]').disabled = false;
    });
  };

  var watchTypeNotice = function () {
    var type = document.querySelector('#type');
    var price = document.querySelector('#price');

    price.min = typeApartmentMap[type.value][1];
    price.placeholder = typeApartmentMap[type.value][1];
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

  window.form = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
