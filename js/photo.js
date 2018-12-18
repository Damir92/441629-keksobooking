'use strict';
(function () {

  var FILE_TYPES = ['gif', 'jpeg', 'jpg', 'png'];

  var fileChooserAvatar = document.querySelector('#avatar');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');

  fileChooserAvatar.addEventListener('change', function () {
    var file = fileChooserAvatar.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewAvatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  var fileChooserPhotos = document.querySelector('#images');
  var previewPhotos = document.querySelector('.ad-form__photo');

  fileChooserPhotos.addEventListener('change', function () {
    var file = fileChooserPhotos.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        var previewImg = document.createElement('img');
        previewImg.src = reader.result;
        previewImg.style = 'height: 70px; width: 70px; object-fit: fill';
        previewPhotos.appendChild(previewImg);
      });

      reader.readAsDataURL(file);
    }
  });

})();
