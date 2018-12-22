'use strict';

(function () {

  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_WIDTH = 62;
  var HALF_WIDTH_PIN = 25;
  var HEIGHT_PIN = 70;

  var adForm = document.querySelector('.ad-form');
  var mainMap = window.data.mainMap;
  var deleteCard = window.card.deleteBlock;
  var makeCardBlock = window.card.makeBlock;

  // Функция для рассчета положения пина
  var calculatePosition = function (pin) {
    var posLeft = pin.offsetTop + MAIN_PIN_HEIGHT;
    var posTop = pin.offsetLeft + MAIN_PIN_WIDTH / 2;

    adForm.querySelector('#address').value = posLeft + ', ' + posTop;
  };

  // Функция, наполняющая шаблон пинов на карте информацией
  var renderPin = function (apartment) {
    var pinElement = document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);

    pinElement.style = 'left: ' + (apartment.location.x - HALF_WIDTH_PIN) + 'px; top: ' + (apartment.location.y - HEIGHT_PIN) + 'px';
    pinElement.querySelector('img').src = apartment.author.avatar;
    pinElement.querySelector('img').alt = apartment.offer.title;

    pinElement.addEventListener('click', function () {
      deleteCard();
      makeCardBlock(apartment);
      pinElement.classList.add('map__pin--active');
    });

    return pinElement;
  };

  // Функция, создающая DOM-элемент с пинами объявлений на карте
  var makePinsBlock = function (apartmentArr) {
    var pinListElement = mainMap.querySelector('.map__pins');

    pinListElement.querySelectorAll('.map__pin').forEach(function (elem) {
      if (!elem.classList.contains('map__pin--main')) {
        elem.remove();
      }
    });

    var fragmentPins = document.createDocumentFragment();
    var takeNumber = apartmentArr.length > 5 ? 5 : apartmentArr.length;

    for (var i = 0; i < takeNumber; i++) {
      fragmentPins.appendChild(renderPin(apartmentArr[i]));
    }
    pinListElement.appendChild(fragmentPins);
  };

  window.pin = {
    calculatePosition: calculatePosition,
    makePinsBlock: makePinsBlock,
    adForm: adForm
  };

})();
