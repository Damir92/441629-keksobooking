'use strict';

(function () {
  var mainMap = window.data.mainMap;
  var makePageActive = window.map.makePageActive;
  var calculatePosition = window.pin.calculatePosition;

  // Функция перемещения пина
  var moveMarker = function (offset, shift, temp, sideMin, sideMax, spare) {
    if (offset - shift - temp < sideMin - spare) {
      if (temp) {
        temp += shift;
      } else {
        temp += shift - (offset - (sideMin - spare));
      }
      return [(sideMin - spare + 'px'), temp];
    } else if (offset - shift - temp < sideMax - spare) {
      if (temp) {
        shift += temp;
        temp = 0;
      }
      return [((offset - shift) + 'px'), temp];
    } else {
      if (temp) {
        temp += shift;
      } else {
        temp += shift - (offset - (sideMax - spare));
      }
      return [((sideMax - spare) + 'px'), temp];
    }
  };

  // Функция отслеживания пина
  var addHandlerToMainPin = function () {
    var mainPin = document.querySelector('.map__pin--main');

    var TOP = 130;
    var BOTTOM = 630;
    var LEFT = 0;
    var RIGHT = mainMap.offsetWidth;
    var HALF_WIDTH_MAIN_PIN = 31;
    var HEIGHT_PIN = 84;

    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var tempLeft = 0;
      var tempTop = 0;
      var resultX = [];
      var resultY = [];

      if (window.data.firstMovePin) {
        makePageActive();
        window.data.firstMovePin = false;
      }

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        // Рассчет передвижения маркера по-горизонтали, с учетом границ
        resultX = moveMarker(mainPin.offsetLeft, shift.x, tempLeft, LEFT, RIGHT, HALF_WIDTH_MAIN_PIN);
        mainPin.style.left = resultX[0];
        tempLeft = resultX[1];

        // Рассчет передвижения маркера по-вертикали, с учетом границ
        resultY = moveMarker(mainPin.offsetTop, shift.y, tempTop, TOP, BOTTOM, HEIGHT_PIN);
        mainPin.style.top = resultY[0];
        tempTop = resultY[1];

        calculatePosition(mainPin);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        calculatePosition(mainPin);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  addHandlerToMainPin();

})();
