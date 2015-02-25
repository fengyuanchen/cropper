(function () {

  'use strict';

  window.createCropperImage = function (url) {
    var image = new Image();

    image.src = url || '../assets/img/picture.jpg';

    $('<div>').addClass('container').append(image).appendTo(document.body);

    return image;
  }

  $.fn.cropper.setDefaults({
    global: false
  });

})();
