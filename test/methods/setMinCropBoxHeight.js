$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');
      var options = cropper.options;
      var minCropBoxHeight = 500;

      QUnit.test('methods.setMinCropBoxHeight', function (assert) {
        assert.equal(options.minCropBoxHeight, 0);
        cropper.setMinCropBoxHeight(minCropBoxHeight);
        assert.equal(options.minCropBoxHeight, minCropBoxHeight);
      });

    }
  });

});
