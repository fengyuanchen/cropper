$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('methods.clear', function (assert) {
        $image.cropper('clear');
        assert.ok(!cropper.cropped);
        assert.ok(cropper.$cropBox.is(':hidden'));
        assert.deepEqual($image.cropper('getCropBoxData'), {});
      });

    }
  });

});
