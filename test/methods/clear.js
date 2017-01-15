$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('methods#clear', function (assert) {
        $image.cropper('clear');
        assert.equal(cropper.cropped, false);
        assert.ok(cropper.$cropBox.is(':hidden'));
        assert.deepEqual($image.cropper('getCropBoxData'), {});
      });

    }
  });

});
