$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({

    built: function () {
      var cropper = $(this).data('cropper');
      var image = cropper.image;
      var scaleX = -2;
      var scaleY = 2;

      QUnit.test('methods.scale', function (assert) {
        $image.cropper('scale', scaleX, scaleY);
        assert.equal(image.scaleX, scaleX);
        assert.equal(image.scaleY, scaleY);
      });

    }
  });

});
