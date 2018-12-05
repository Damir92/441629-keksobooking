'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var mainMap = window.data.mainMap;
  var deleteCard = window.card.deleteCard;
  var makeCardBlock = window.card.makeCardBlock;

  // Функция для рассчета положения пина
  var calculatePosition = function (pin) {
    var MAIN_PIN_HEIGHT = 84;
    var MAIN_PIN_WIDTH = 62;

    var posLeft = pin.offsetTop + MAIN_PIN_HEIGHT;
    var posTop = pin.offsetLeft + MAIN_PIN_WIDTH / 2;

    adForm.querySelector('#address').value = posLeft + ', ' + posTop;
  };

  // Функция, наполняющая шаблон пинов на карте информацией
  var renderPin = function (apartment) {
    var HALF_WIDTH_PIN = 25;
    var HEIGHT_PIN = 70;

    var pinElement = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);

    pinElement.style = 'left: ' + (apartment.location.x - HALF_WIDTH_PIN) + 'px; top: ' + (apartment.location.y - HEIGHT_PIN) + 'px';
    pinElement.querySelector('img').src = apartment.author.avatar;
    pinElement.querySelector('img').alt = apartment.offer.title;

    pinElement.addEventListener('click', function () {
      deleteCard();
      makeCardBlock(apartment);
    });

    return pinElement;
  };

  // Функция, создающая DOM-элемент с пинами объявлений на карте
  var makePinsBlock = function (apartmentArr) {
    var pinListElement = mainMap.querySelector('.map__pins');
    var fragmentPins = document.createDocumentFragment();

    apartmentArr.forEach(function (elem) {
      fragmentPins.appendChild(renderPin(elem));
    });
    pinListElement.appendChild(fragmentPins);
  };

  window.pin = {
    calculatePosition: calculatePosition,
    makePinsBlock: makePinsBlock
  };

})();
