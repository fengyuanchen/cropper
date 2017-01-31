$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');
      var options = cropper.options;
      var aspectRatio = 16 / 9;

      QUnit.test('options#aspectRatio', function (assert) {
        assert.ok(isNaN(options.aspectRatio));
        cropper.setAspectRatio(aspectRatio);
        assert.equal(options.aspectRatio, aspectRatio);
      });

    }
  });

});
