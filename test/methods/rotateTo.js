$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods.rotateTo', function (assert) {
        assert.equal($image.cropper('rotateTo', 360).cropper('getImageData').rotate, 0);
        assert.equal($image.cropper('rotateTo', 90).cropper('getImageData').rotate, 90);
        assert.equal($image.cropper('rotateTo', 0).cropper('getImageData').rotate, 0);
      });

    }
  });

});
