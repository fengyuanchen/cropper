$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    autoCrop: false,

    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('methods#crop', function (assert) {
        $image.cropper('crop');
        assert.equal(cropper.cropped, true);
        assert.ok(cropper.$cropBox.is(':visible'));
      });

    }
  });

});
