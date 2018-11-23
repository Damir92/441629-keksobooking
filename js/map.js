'use strict';

var NUM_OFFERS = 8;
var AVATAR = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира',
  'Огромный прекрасный дворец', 'Маленький ужасный дворец',
  'Красивый гостевой домик', 'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря', 'Неутное бунгало по колено в воде'
];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var MAP_WIDTH = map.offsetWidth;

var pinListElement = map.querySelector('.map__pins');
var mapFilterContainer = map.querySelector('.map__filters-container');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

// Функция, создающая массив объектов
var makeApartment = function (numOffers) {
  var apartments = [];

  var shuffleAvatarArr = shuffleArray(AVATAR);
  var shuffleTitleArr = shuffleArray(TITLE);

  for (var i = 0; i < numOffers; i++) {
    var locationX = getRandom(0, MAP_WIDTH);
    var locationY = getRandom(130, 630);

    apartments[i] = {
      author: {
        avatar: 'img/avatars/user' + shuffleAvatarArr[i] + '.png'
      },

      offer: {
        title: shuffleTitleArr[i],
        address: locationX + ', ' + locationY,
        price: getRandom(0, 1000) * 1000,
        type: getRandomElement(TYPE),
        rooms: getRandom(1, 5),
        guests: getRandom(1, 10),
        checkin: getRandomElement(CHECKIN),
        checkout: getRandomElement(CHECKOUT),
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
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.style = 'left: ' + (apartment.location.x - 25) + 'px; top: ' + (apartment.location.y - 70) + 'px';
  pinElement.querySelector('img').src = apartment.author.avatar;
  pinElement.querySelector('img').alt = apartment.offer.title;

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
  var cardElement = cardTemplate.cloneNode(true);

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
  var fragmentPins = document.createDocumentFragment();

  apartmentArr.forEach(function (elem) {
    fragmentPins.appendChild(renderPin(elem));
  });
  pinListElement.appendChild(fragmentPins);
};

// функция, создающая DOM-элемент с карточкой объявления
var makeCardBlock = function (apartment) {
  var fragmentCard = document.createDocumentFragment();

  fragmentCard.appendChild(renderCard(apartment));
  map.insertBefore(fragmentCard, mapFilterContainer);
};

// Блок выполнения
var apartmentOffers = makeApartment(NUM_OFFERS);

makePinsBlock(apartmentOffers);
makeCardBlock(apartmentOffers[0]);
