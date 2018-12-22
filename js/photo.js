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

  var photosContainer = document.querySelector('.ad-form__photo-container');
  var fileChooserPhotos = photosContainer.querySelector('#images');

  fileChooserPhotos.addEventListener('change', function () {
    var readers = [];

    for (var i = 0; i < fileChooserPhotos.files.length; i++) {

      var file = fileChooserPhotos.files[i];
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        readers[i] = new FileReader();

        readers[i].addEventListener('load', onPhotoChooserLoad);

        readers[i].readAsDataURL(file);
      }
    }
  });

  var onPhotoChooserLoad = function (evt) {
    var previewPhotos = photosContainer.querySelectorAll('.ad-form__photo');
    var previewImg = document.createElement('img');
    previewImg.src = evt.target.result;
    previewImg.style = 'height: 70px; width: 70px; object-fit: fill';

    var newBlock = previewPhotos[previewPhotos.length - 1].cloneNode();
    previewPhotos[previewPhotos.length - 1].appendChild(previewImg);
    photosContainer.appendChild(newBlock);
  };

})();
