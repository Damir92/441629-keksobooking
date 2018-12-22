'use strict';

(function () {

  var priceMap = {
    low: [0, 10000],
    middle: [10000, 50000],
    high: [50000, Infinity]
  };

  var makePinsBlock = window.pin.makePinsBlock;
  var deleteCard = window.card.deleteBlock;
  var filters = document.querySelector('.map__filters');

  var sortByPrice = function (elem) {
    return ((wish.price === 'any') ||
      (elem.offer.price >= priceMap[wish.price][0] &&
        elem.offer.price < priceMap[wish.price][1]));
  };

  var sortByType = function (elem) {
    return (wish.type === 'any' ||
      elem.offer.type === wish.type);
  };

  var sortByRooms = function (elem) {
    return (wish.rooms === 'any' ||
      elem.offer.rooms === parseInt(wish.rooms, 10));
  };

  var sortByGuests = function (elem) {
    return (wish.guests === 'any' ||
      elem.offer.guests === parseInt(wish.guests, 10));
  };

  var sortByFeatures = function (elem) {
    var result = true;
    wish.features.forEach(function (feature) {
      if (elem.offer.features.indexOf(feature) === -1) {
        result = false;
      }
    });
    return result;
  };

  var updateOffers = window.debounce(function () {
    var sortedOffers = [];
    deleteCard();

    window.map.apartmentOffers.forEach(function (elem) {
      if (sortByType(elem) &&
        sortByPrice(elem) &&
        sortByRooms(elem) &&
        sortByGuests(elem) &&
        sortByFeatures(elem)) {
        sortedOffers.push(elem);
      }
    });

    makePinsBlock(sortedOffers);
  });

  var wish = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: []
  };

  var wishType = filters.querySelector('#housing-type');
  wishType.addEventListener('change', function () {
    wish.type = wishType.value;
    updateOffers();
  });

  var wishPrice = filters.querySelector('#housing-price');
  wishPrice.addEventListener('change', function () {
    wish.price = wishPrice.value;
    updateOffers();
  });

  var wishRooms = filters.querySelector('#housing-rooms');
  wishRooms.addEventListener('change', function () {
    wish.rooms = wishRooms.value;
    updateOffers();
  });

  var wishGuests = filters.querySelector('#housing-guests');
  wishGuests.addEventListener('change', function () {
    wish.guests = wishGuests.value;
    updateOffers();
  });

  var wishFeatures = filters.querySelector('#housing-features');
  wishFeatures.addEventListener('change', function () {
    var checkedFeatures = [];
    wishFeatures.querySelectorAll('.map__checkbox').forEach(function (elem) {
      if (elem.checked) {
        checkedFeatures.push(elem.value);
      }
    });
    wish.features = checkedFeatures;
    updateOffers();
  });

})();
