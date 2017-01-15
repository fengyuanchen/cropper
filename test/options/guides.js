$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    guides: false,

    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#guides', function (assert) {
        assert.ok(cropper.$cropper.find('.cropper-dashed').hasClass('cropper-hidden'));
      });

    }
  });

});
