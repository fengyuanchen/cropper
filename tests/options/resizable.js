$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    resizable: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.resizable', function (assert) {
        assert.ok(cropper.$cropper.find('.cropper-line, .cropper-point').hasClass('cropper-hidden'));
      });

    }
  });

});
