$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    cropBoxResizable: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#cropBoxResizable', function (assert) {
        assert.ok(cropper.$cropper.find('.cropper-line, .cropper-point').hasClass('cropper-hidden'));
      });

    }
  });

});
