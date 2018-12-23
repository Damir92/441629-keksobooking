'use strict';

(function () {

  var typeApartmentMap = window.data.typeApartmentMap;
  var capacityApartmentMap = window.data.capacityApartmentMap;
  var adForm = window.pin.adForm;
  var filterForm = document.querySelector('.map__filters');
  var noticePrice = adForm.querySelector('#price');
  var rooms = adForm.querySelector('#room_number');
  var guests = adForm.querySelector('#capacity');

  // Функция, меняет ошибку при попытке отправки заголовка
  var onTitleInvalid = function () {
    var noticeTitle = adForm.querySelector('#title');
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
  var onTitleInput = function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Заголовок должен содержать не менее 30-ти символов! Сейчас символов: ' + target.value.length);
    } else {
      target.setCustomValidity('');
    }
  };

  var onPriceInvalid = function () {
    if (noticePrice.validity.rangeUnderflow) {
      noticePrice.setCustomValidity('Минимальная стоимость: ' + noticePrice.min);
    } else if (noticePrice.validity.rangeOverflow) {
      noticePrice.setCustomValidity('Кажется, у Вас в стоимости многовато цифр! Максимальная стоимость 1 000 000');
    } else if (noticePrice.validity.valueMissing) {
      noticePrice.setCustomValidity('Обязательное поле');
    } else {
      noticePrice.setCustomValidity('');
    }
  };

  var onPriceInput = function (evt) {
    var target = evt.target;
    if (target.value < noticePrice.min) {
      target.setCustomValidity('Настолько дешёвого жилья не бывает! Добавьте еще ' + (noticePrice.min - target.value));
    } else {
      target.setCustomValidity('');
    }
  };

  var onRoomNumberInput = function () {
    changeGuestsInRooms(rooms, guests);
  };

  var changeGuestsInRooms = function (rooms, guests) {
    guests.value = '';

    guests.querySelectorAll('option').forEach(function (elem) {
      elem.style.display = 'none';
    });

    capacityApartmentMap[rooms.value].forEach(function (elem) {
      guests.querySelector('[value="' + elem + '"]').style.display = 'block';
    });
  };

  // var validateGuests = function () {
  //   // var result = true;
  //   if (capacityApartmentMap[rooms.value].indexOf(guests.value) === -1) {
  //     guests.setCustomValidity('Bad');
  //     guests.value = ''
  //     return false;
  //   }
  //   console.log(capacityApartmentMap[rooms.value], guests.value);
  //   return true;
  // }

  var onTypeInput = function () {
    var type = adForm.querySelector('#type');
    var price = adForm.querySelector('#price');

    price.min = typeApartmentMap[type.value][1];
    price.placeholder = typeApartmentMap[type.value][1];
  };

  var onTimeInInput = function () {
    var timeIn = adForm.querySelector('#timein');
    var timeOut = adForm.querySelector('#timeout');

    if (timeIn.value) {
      timeOut.value = timeIn.value;
    }
  };

  var onTimeOutInput = function () {
    var timeIn = adForm.querySelector('#timein');
    var timeOut = adForm.querySelector('#timeout');

    if (timeOut.value) {
      timeIn.value = timeOut.value;
    }
  };

  var activate = function () {
    adForm.querySelector('#title').addEventListener('invalid', onTitleInvalid);
    adForm.querySelector('#title').addEventListener('input', onTitleInput);
    adForm.querySelector('#price').addEventListener('invalid', onPriceInvalid);
    adForm.querySelector('#price').addEventListener('input', onPriceInput);
    adForm.querySelector('#room_number').addEventListener('input', onRoomNumberInput);
    adForm.querySelector('#type').addEventListener('input', onTypeInput);
    adForm.querySelector('#timein').addEventListener('input', onTimeInInput);
    adForm.querySelector('#timeout').addEventListener('input', onTimeOutInput);
  };

  var deactivate = function () {
    adForm.querySelector('#title').removeEventListener('invalid', onTitleInvalid);
    adForm.querySelector('#title').removeEventListener('input', onTitleInput);
    adForm.querySelector('#price').removeEventListener('invalid', onPriceInvalid);
    adForm.querySelector('#price').removeEventListener('input', onPriceInput);
    adForm.querySelector('#room_number').removeEventListener('input', onRoomNumberInput);
    adForm.querySelector('#type').removeEventListener('input', onTypeInput);
    adForm.querySelector('#timein').removeEventListener('input', onTimeInInput);
    adForm.querySelector('#timeout').removeEventListener('input', onTimeOutInput);
  };

  window.form = {
    activate: activate,
    deactivate: deactivate
  };

})();
