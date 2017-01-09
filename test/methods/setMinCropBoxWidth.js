$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');
      var options = cropper.options;
      var minCropBoxWidth = 500;

      QUnit.test('methods.setMinCropBoxWidth', function (assert) {
        assert.equal(options.minCropBoxWidth, 0);
        cropper.setMinCropBoxWidth(minCropBoxWidth);
        assert.equal(options.minCropBoxWidth, minCropBoxWidth);
      });

    }
  });

});
