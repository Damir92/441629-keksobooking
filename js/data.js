'use strict';

(function () {
  var NUM_OFFERS = 8;
  var AVATARS = ['01', '02', '03', '04', '05', '06', '07', '08'];
  var TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неутное бунгало по колено в воде'
  ];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var firstMovePin = true;
  var mainMap = document.querySelector('.map');

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
    var MAP_WIDTH = mainMap.offsetWidth;

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

  var apartmentOffers = makeApartment(NUM_OFFERS);

  window.data = {
    FEATURES: FEATURES,
    mainMap: mainMap,
    firstMovePin: firstMovePin,
    apartmentOffers: apartmentOffers,
  };

})();
