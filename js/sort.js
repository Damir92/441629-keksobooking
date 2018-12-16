'use strict';

(function () {

  var priceMap = {
    low: [0, 10000],
    middle: [10000, 50000],
    high: [50000, Infinity]
  };

  var makePinsBlock = window.pin.makePinsBlock;
  var deleteCard = window.card.deleteCard;
  var filters = document.querySelector('.map__filters');

  var updateOffers = window.debounce(function () {
    var sortedOffers = [];
    deleteCard();

    window.map.apartmentOffers.forEach(function (elem) {
      if (elem.offer.type === wish.type || wish.type === 'any') {
        sortedOffers.push(elem);
      }
    });

    if (wish.price !== 'any') {
      sortedOffers = sortedOffers.filter(function (elem) {
        return (elem.offer.price >= priceMap[wish.price][0] && elem.offer.price < priceMap[wish.price][1]);
      });
    }

    if (wish.rooms !== 'any') {
      sortedOffers = sortedOffers.filter(function (elem) {
        return (elem.offer.rooms === parseInt(wish.rooms, 10));
      });
    }

    if (wish.guests !== 'any') {
      sortedOffers = sortedOffers.filter(function (elem) {
        return (elem.offer.guests === parseInt(wish.guests, 10));
      });
    }

    for (var i = 0; i < wish.features.length; i++) {
      sortedOffers = sortedOffers.filter(function (elem) {
        return (elem.offer.features.includes(wish.features[i]));
      });
    }


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
      if (elem.checked === true) {
        checkedFeatures.push(elem.value);
      }
    });
    wish.features = checkedFeatures;
    updateOffers();
  });

  window.wish = wish;

})();
