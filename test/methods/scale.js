$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({

    ready: function () {

      QUnit.test('methods#scale', function (assert) {
        var imageData = $image.cropper('scale', -1, -1).cropper('getImageData');

        assert.equal(imageData.scaleX, -1);
        assert.equal(imageData.scaleY, -1);
      });

    }
  });

});
