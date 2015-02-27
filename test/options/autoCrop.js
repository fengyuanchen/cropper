$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    autoCrop: false,

    crop: function () {
      QUnit.test('options.autoCrop', function (assert) {
        assert.ok(false);
      });
    },

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.autoCrop', function (assert) {
        assert.notEqual(cropper.cropped, true);
      });

    }
  });

});
