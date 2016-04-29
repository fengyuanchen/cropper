$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    center: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#center', function (assert) {
        assert.ok(cropper.$cropper.find('.cropper-center').hasClass('cropper-hidden'));
      });

    }
  });

});
