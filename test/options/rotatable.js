$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var $image2 = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.rotatable: true', function (assert) {
        $image.cropper('rotate', 90);

        assert.equal(cropper.image.rotate, 90);
      });

    }
  });

  $image2.cropper({
    rotatable: false,

    built: function () {
      var cropper = $image2.data('cropper');

      QUnit.test('options.rotatable: false', function (assert) {
        $image2.cropper('rotate', 90);

        assert.ok(typeof cropper.image.rotate === 'undefined');
      });

    }
  });

});
