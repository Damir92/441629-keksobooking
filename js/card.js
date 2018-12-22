'use strict';

(function () {
  var ESC_KEYCODE = window.data.ESC_KEYCODE;
  var FEATURES = window.data.FEATURES;
  var typeApartmentMap = window.data.typeApartmentMap;
  var mainMap = window.data.mainMap;

  // Функция, удаляющая старую карточку
  var deleteBlock = function () {
    var oldCard = mainMap.querySelector('.map__card');

    if (oldCard) {
      document.removeEventListener('keydown', onCardEscPress);
      document.querySelector('.popup__close').removeEventListener('click', onPopupCloseClick);
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      mainMap.removeChild(oldCard);
    }
  };

  var onCardEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      deleteBlock();
    }
  };

  var onPopupCloseClick = function () {
    deleteBlock();
  };

  // Функция, наполняющая DOM-элемент по шаблону
  var renderBlock = function (apartment) {
    var cardElement = document.querySelector('#card').content.querySelector('.map__card').cloneNode(true);

    cardElement.querySelector('.popup__avatar').src = apartment.author.avatar;
    cardElement.querySelector('.popup__title').textContent = apartment.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = apartment.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = apartment.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = typeApartmentMap[apartment.offer.type][0];
    cardElement.querySelector('.popup__text--capacity').textContent = apartment.offer.rooms + ' комнаты для ' + apartment.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + apartment.offer.checkin + ', выезд до ' + apartment.offer.checkout;

    makeFeatures(apartment, cardElement);
    makeDescription(apartment, cardElement);
    makePhotos(apartment, cardElement);

    return cardElement;
  };

  // Функция, создающая блок с удобствами
  var makeFeatures = function (apartment, cardElement) {
    if (apartment.offer.features.length) {
      FEATURES.forEach(function (elem) {
        var searchClass = '.popup__feature--' + elem;
        var searchElem = cardElement.querySelector(searchClass);

        if (apartment.offer.features.indexOf(elem) === -1) {
          cardElement.querySelector('.popup__features').removeChild(searchElem);
        }
      });
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__features'));
    }
  };

  // Функция, создающая блок с описанием
  var makeDescription = function (apartment, cardElement) {
    if (apartment.offer.description) {
      cardElement.querySelector('.popup__description').textContent = apartment.offer.description;
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__description'));
    }
  };

  // Функция, создающая блок с фото
  var makePhotos = function (apartment, cardElement) {
    if (apartment.offer.photos.length) {
      apartment.offer.photos.forEach(function (photo) {
        var popupPhoto = cardElement.querySelector('.popup__photo').cloneNode();

        cardElement.querySelector('.popup__photos').lastElementChild.src = photo;
        cardElement.querySelector('.popup__photos').appendChild(popupPhoto);
      });
      cardElement.querySelector('.popup__photos').removeChild(cardElement.querySelector('.popup__photos').lastElementChild);
    } else {
      cardElement.removeChild(cardElement.querySelector('.popup__photos'));
    }
  };

  // Функция, создающая DOM-элемент с карточкой объявления
  var makeBlock = function (apartment) {
    var mapFilterContainer = mainMap.querySelector('.map__filters-container');
    var newCard = renderBlock(apartment);

    mainMap.insertBefore(newCard, mapFilterContainer);

    document.addEventListener('keydown', onCardEscPress);
    document.querySelector('.popup__close').addEventListener('click', onPopupCloseClick);
  };

  window.card = {
    deleteBlock: deleteBlock,
    makeBlock: makeBlock
  };

})();
