$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var imageData = $image.cropper('getImageData'),
          cropBoxData = $image.cropper('getCropBoxData');

      QUnit.test('methods.reset', function (assert) {
        $image.cropper('setImageData', {
          top: imageData.top + 10,
          width: imageData.width - 10
        });

        assert.notDeepEqual($image.cropper('getImageData'), imageData);

        $image.cropper('setCropBoxData', {
          left: cropBoxData.left + 10,
          height: cropBoxData.height - 10
        });

        assert.notDeepEqual($image.cropper('getCropBoxData'), cropBoxData);

        $image.cropper('reset');
        assert.deepEqual($image.cropper('getImageData'), imageData);
        assert.deepEqual($image.cropper('getCropBoxData'), cropBoxData);
      });

    }
  });

});
