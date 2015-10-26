$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    autoCrop: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('methods.crop', function (assert) {
        $image.cropper('crop');
        assert.equal(cropper.isCropped, true);
        assert.ok(cropper.$cropBox.is(':visible'));
      });

    }
  });

});
