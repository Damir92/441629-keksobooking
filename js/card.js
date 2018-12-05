'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var FEATURES = window.data.FEATURES;

  var mainMap = window.data.mainMap;

  // Функция, удаляющая старую карточку
  var deleteCard = function () {
    var oldCard = mainMap.querySelector('.map__card');

    if (oldCard) {
      document.removeEventListener('keydown', onCardEscPress);
      document.querySelector('.popup__close').removeEventListener('click', deleteCard);
      mainMap.removeChild(oldCard);
    }
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      deleteCard();
    }
  };

  // Возвращает тип жилья
  var chooseTypeApartment = function (apartment) {
    if (apartment.offer.type === 'flat') {
      return 'Квартира';
    } else if (apartment.offer.type === 'bungalo') {
      return 'Бунгало';
    } else if (apartment.offer.type === 'house') {
      return 'Дом';
    } else {
      return 'Дворец';
    }
  };

  // Функция, наполняющая DOM-элемент по шаблону
  var renderCard = function (apartment) {
    var cardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);

    cardElement.querySelector('.popup__avatar').src = apartment.author.avatar;
    cardElement.querySelector('.popup__title').textContent = apartment.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = apartment.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = apartment.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = chooseTypeApartment(apartment);
    cardElement.querySelector('.popup__text--capacity').textContent = apartment.offer.rooms + ' комнаты для ' + apartment.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + apartment.offer.checkin + ', выезд до ' + apartment.offer.checkout;

    FEATURES.forEach(function (elem) {
      var searchClass = '.popup__feature--' + elem;
      var searchElem = cardElement.querySelector(searchClass);

      if (apartment.offer.features.indexOf(elem) === -1) {
        cardElement.querySelector('.popup__features').removeChild(searchElem);
      }
    });

    cardElement.querySelector('.popup__description').textContent = apartment.offer.description;

    apartment.offer.photos.forEach(function (photo) {
      var popupPhoto = cardElement.querySelector('.popup__photo').cloneNode();

      cardElement.querySelector('.popup__photos').lastElementChild.src = photo;
      cardElement.querySelector('.popup__photos').appendChild(popupPhoto);
    });
    cardElement.querySelector('.popup__photos').removeChild(cardElement.querySelector('.popup__photos').lastElementChild);

    return cardElement;
  };

  // Функция, создающая DOM-элемент с карточкой объявления
  var makeCardBlock = function (apartment) {
    var mapFilterContainer = mainMap.querySelector('.map__filters-container');
    var newCard = renderCard(apartment);

    mainMap.insertBefore(newCard, mapFilterContainer);

    document.addEventListener('keydown', onCardEscPress);
    document.querySelector('.popup__close').addEventListener('click', deleteCard);
  };

  window.card = {
    deleteCard: deleteCard,
    makeCardBlock: makeCardBlock
  };

})();
