(function () {

  'use strict';

  window.createCropperImage = function (attr) {
    var image = new Image();

    if (!$.isPlainObject(attr)) {
      attr = {};
    }

    if (!attr.src) {
      attr.src = '../assets/img/picture.jpg';
    }

    $('<div>').addClass('container').append($(image).attr(attr)).appendTo(document.body);

    return image;
  };

})();
