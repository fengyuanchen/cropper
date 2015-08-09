$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var $image2 = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');
      var image = cropper.image;

      QUnit.test('options.scalable: true', function (assert) {
        $image.cropper('scale', 2, -2);

        assert.equal(image.scaleX, 2);
        assert.equal(image.scaleY, -2);
      });

    }
  });

  $image2.cropper({
    scalable: false,

    built: function () {
      var cropper = $image2.data('cropper');
      var image = cropper.image;

      QUnit.test('options.scalable: false', function (assert) {
        $image2.cropper('scale', 2, -2);

        assert.ok(typeof image.scaleX === 'undefined');
        assert.ok(typeof image.scaleY === 'undefined');
      });

    }
  });

});
