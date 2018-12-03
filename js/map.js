'use strict';

var ESC_KEYCODE = 27;
var AVATARS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира',
  'Огромный прекрасный дворец', 'Маленький ужасный дворец',
  'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неутное бунгало по колено в воде'
];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var firstMovePin = true;
var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');

// Функция, активирующая блок карты
var activateMap = function () {
  if (map.classList.contains('map--faded')) {
    map.classList.remove('map--faded');
  }
};

// Функция, активирующая блок параметров
var activateNotice = function () {
  if (adForm.classList.contains('ad-form--disabled')) {
    adForm.classList.remove('ad-form--disabled');
  }
};

// Функция, деактивирующая блок карты
var deactivateMap = function () {
  if (!map.classList.contains('map--faded')) {
    map.classList.add('map--faded');
  }
};

// Функция, деактивирующая блок параметров
var deactivateNotice = function () {
  if (!adForm.classList.contains('ad-form--disabled')) {
    adForm.classList.add('ad-form--disabled');
  }
};

// Функция, возвращающая случайное число в пределах отрезка [minLimit, maxLimit]
var getRandom = function (minLimit, maxLimit) {
  return Math.round(Math.random() * (maxLimit - minLimit) + minLimit);
};

// Функция, возвращающая случайный элемент массива
var getRandomElement = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Функция, возвращающая новый перемешанный массив
var shuffleArray = function (arr) {
  var newArray = arr.slice();

  for (var i = newArray.length - 1; i > 0; i--) {

    var index = Math.floor(Math.random() * (i + 1));
    var element = newArray[i];

    newArray[i] = newArray[index];
    newArray[index] = element;
  }

  return newArray;
};

// Функция для рассчета положения пина
var calculatePosition = function (pin) {
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_WIDTH = 62;

  var posLeft = pin.offsetTop + MAIN_PIN_HEIGHT;
  var posTop = pin.offsetLeft + MAIN_PIN_WIDTH / 2;

  adForm.querySelector('#address').value = posLeft + ', ' + posTop;
};

// Функция, создающая массив объектов
var makeApartment = function (numOffers) {
  var MAP_WIDTH = map.offsetWidth;

  var apartments = [];

  var shuffleAvatarsArr = shuffleArray(AVATARS);
  var shuffleTitlesArr = shuffleArray(TITLES);

  for (var i = 0; i < numOffers; i++) {
    var locationX = getRandom(0, MAP_WIDTH);
    var locationY = getRandom(130, 630);

    apartments[i] = {
      author: {
        avatar: 'img/avatars/user' + shuffleAvatarsArr[i] + '.png'
      },

      offer: {
        title: shuffleTitlesArr[i],
        address: locationX + ', ' + locationY,
        price: getRandom(0, 1000) * 1000,
        type: getRandomElement(TYPES),
        rooms: getRandom(1, 5),
        guests: getRandom(1, 10),
        checkin: getRandomElement(CHECKINS),
        checkout: getRandomElement(CHECKOUTS),
        features: shuffleArray(FEATURES).slice(0, getRandom(0, FEATURES.length - 1)),
        description: '',
        photos: shuffleArray(PHOTOS)
      },

      location: {
        x: locationX,
        y: locationY
      }
    };

  }

  return apartments;
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

// Функция, создающая DOM-элемент с пинами объявлений на карте
var makePinsBlock = function (apartmentArr) {
  var pinListElement = map.querySelector('.map__pins');
  var fragmentPins = document.createDocumentFragment();

  apartmentArr.forEach(function (elem) {
    fragmentPins.appendChild(renderPin(elem));
  });
  pinListElement.appendChild(fragmentPins);
};

// Функция, создающая DOM-элемент с карточкой объявления
var makeCardBlock = function (apartment) {
  var mapFilterContainer = map.querySelector('.map__filters-container');
  var newCard = renderCard(apartment);

  map.insertBefore(newCard, mapFilterContainer);

  document.addEventListener('keydown', onCardEscPress);
  document.querySelector('.popup__close').addEventListener('click', deleteCard);
};

// Функция, деактивирующая поля формы
var makePageEnactive = function () {
  document.querySelectorAll('fieldset').forEach(function (elem) {
    elem.disabled = true;
  });

  document.querySelectorAll('select').forEach(function (elem) {
    elem.disabled = true;
  });
};

// Функция, активирующая поля формы
var makePageActive = function () {
  document.querySelectorAll('fieldset').forEach(function (elem) {
    elem.disabled = false;
  });

  document.querySelectorAll('select').forEach(function (elem) {
    elem.disabled = false;
  });

  activateMap();
  activateNotice();

  document.querySelector('#title').addEventListener('invalid', showTitleValidityMessage);
  document.querySelector('#title').addEventListener('input', changeTitleValidityMessage);
  document.querySelector('#price').addEventListener('invalid', showPriceValidityMessage);
  document.querySelector('#price').addEventListener('input', changePriceValidityMessage);
  document.querySelector('#room_number').addEventListener('input', changeRoomsBlock);
  document.querySelector('#type').addEventListener('input', watchTypeNotice);
  document.querySelector('#timein').addEventListener('input', watchTimeIn);
  document.querySelector('#timeout').addEventListener('input', watchTimeOut);
  document.querySelector('.ad-form__reset').addEventListener('click', resetPage);
};

// Функция, старую карточку
var deleteCard = function () {
  var oldCard = map.querySelector('.map__card');

  if (oldCard) {
    document.removeEventListener('keydown', onCardEscPress);
    document.querySelector('.popup__close').removeEventListener('click', deleteCard);
    map.removeChild(oldCard);
  }
};

var onCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    deleteCard();
  }
};

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

var resetPage = function (evt) {
  evt.preventDefault();

  makePageEnactive();
  document.querySelector('.map__pin--main').style.left = '570px';
  document.querySelector('.map__pin--main').style.top = '375px';
  document.querySelectorAll('form').forEach(function (elem) {
    elem.reset();
  });
  document.querySelectorAll('.map__pin').forEach(function (elem) {
    if (!elem.classList.contains('map__pin--main')) {
      map.querySelector('.map__pins').removeChild(elem);
    }
  });
  deactivateMap();
  deactivateNotice();
  firstMovePin = true;

  calculatePosition(document.querySelector('.map__pin--main'));
};

window.maps = {
  adForm: adForm,
  calculatePosition: calculatePosition,
  makePageActive: makePageActive,
  makePinsBlock: makePinsBlock,
  makeApartment: makeApartment,
  map: map,
  firstMovePin: firstMovePin
};

// Блок выполнения
// calculatePosition(document.querySelector('.map__pin--main'));

makePageEnactive();
