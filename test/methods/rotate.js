$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods#rotate', function (assert) {
        $image.cropper('rotate', 360);
        assert.equal($image.cropper('getImageData').rotate, 0);

        $image.cropper('rotate', 90);
        assert.equal($image.cropper('getImageData').rotate, 90);

        $image.cropper('rotate', -90);
        assert.equal($image.cropper('getImageData').rotate, 0);
      });

    }
  });

});
