$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({

    built: function () {

      QUnit.test('methods#scaleY', function (assert) {
        var imageData = $image.cropper('scaleY', -1).cropper('getImageData');

        assert.equal(imageData.scaleY, -1);
      });

    }
  });

});
