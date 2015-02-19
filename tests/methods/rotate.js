$(function () {

  'use strict';

  var $image = $(window.createCropperImage())

  $image.cropper({
    built: function () {
      var image = $image.data('cropper').image;

      QUnit.test('methods.rotate', function (assert) {
        assert.ok(image.rotate === 0);
        $image.cropper('rotate', 360);
        assert.ok(image.rotate === 0);
        $image.cropper('rotate', 30);
        assert.ok(image.rotate === 30);
        $image.cropper('rotate', -15);
        assert.ok(image.rotate === 15);
        $image.cropper('rotate', -15);
        assert.ok(image.rotate === 0);
      });

    }
  });

});
