$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    autoCrop: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#autoCrop', function (assert) {
        assert.notOk(cropper.isCropped);
      });

    }
  });

});
