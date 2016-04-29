$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    highlight: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#highlight', function (assert) {
        assert.ok(cropper.$cropper.find('.cropper-face').hasClass('cropper-invisible'));
      });

    }
  });

});
