$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    rotatable: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.rotatable', function (assert) {
        $image.cropper('rotate', 15);

        assert.equal(cropper.image.rotate, 0);
      });

    }
  });

});
