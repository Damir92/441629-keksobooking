'use strict';

(function () {

  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var typeApartmentMap = {
    'bungalo': ['Бунгало', 0],
    'flat': ['Квартира', 1000],
    'house': ['Дом', 5000],
    'palace': ['Дворец', 10000]
  };

  var capacityApartmentMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };

  var firstMovePin = true;
  var mainMap = document.querySelector('.map');

  window.data = {
    FEATURES: FEATURES,
    mainMap: mainMap,
    firstMovePin: firstMovePin,
    typeApartmentMap: typeApartmentMap,
    capacityApartmentMap: capacityApartmentMap
  };

})();
