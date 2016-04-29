$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var minContainerWidth = 641;

  $image.cropper({
    minContainerWidth: minContainerWidth,

    built: function () {
      var cropper = $image.data('cropper');
      var container = cropper.container;

      QUnit.test('options#minContainerWidth', function (assert) {
        assert.ok(Math.round(container.width) === minContainerWidth);
      });

    }
  });

});
