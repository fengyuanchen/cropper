$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({

    built: function () {

      QUnit.test('methods.scaleX', function (assert) {
        var imageData = $image.cropper('scaleX', -1).cropper('getImageData');

        assert.equal(imageData.scaleX, -1);
      });

    }
  });

});
