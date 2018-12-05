'use strict';

(function () {

  var mainMap = window.data.mainMap;
  var makePinsBlock = window.pin.makePinsBlock;
  var apartmentOffers = window.data.apartmentOffers;
  var deleteCard = window.card.deleteCard;
  var calculatePosition = window.pin.calculatePosition;
  var adForm = document.querySelector('.ad-form');

  // Функция, активирующая карту и форму
  var makePageActive = function () {
    if (mainMap.classList.contains('map--faded')) {
      mainMap.classList.remove('map--faded');
      makePinsBlock(apartmentOffers);
    }

    if (adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.remove('ad-form--disabled');
    }

    document.querySelectorAll('fieldset').forEach(function (elem) {
      elem.disabled = false;
    });

    document.querySelectorAll('select').forEach(function (elem) {
      elem.disabled = false;
    });

    window.form.activateForm();
    document.querySelector('.ad-form__reset').addEventListener('click', resetPage);

  };

  // Функция, деактивирующая карту и форму
  var makePageEnactive = function () {
    if (!mainMap.classList.contains('map--faded')) {
      mainMap.classList.add('map--faded');
    }

    if (!adForm.classList.contains('ad-form--disabled')) {
      adForm.classList.add('ad-form--disabled');
    }

    document.querySelectorAll('fieldset').forEach(function (elem) {
      elem.disabled = true;
    });

    document.querySelectorAll('select').forEach(function (elem) {
      elem.disabled = true;
    });

    calculatePosition(document.querySelector('.map__pin--main'));
    window.form.deactivateForm();
    document.querySelector('.ad-form__reset').removeEventListener('click', resetPage);
  };

  // Функция, приводит страницу к первоначальному состоянию
  var resetPage = function (evt) {
    evt.preventDefault();

    document.querySelector('.map__pin--main').style = 'left: 570px; top: 375px;';
    document.querySelectorAll('form').forEach(function (elem) {
      elem.reset();
    });

    document.querySelectorAll('.map__pin').forEach(function (elem) {
      if (!elem.classList.contains('map__pin--main')) {
        mainMap.querySelector('.map__pins').removeChild(elem);
      }
    });

    makePageEnactive();
    deleteCard();
    window.data.firstMovePin = true;
  };

  window.map = {
    adForm: adForm,
    makePageActive: makePageActive,
    makePageEnactive: makePageEnactive,
  };

  makePageEnactive();

})();
