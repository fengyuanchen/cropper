$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      minContainerHeight = 361;

  $image.cropper({
    minContainerHeight: minContainerHeight,

    built: function () {
      var cropper = $image.data('cropper'),
          container = cropper.container;

      QUnit.test('options.minContainerHeight', function (assert) {
        assert.ok(Math.round(container.height) === minContainerHeight);
      });

    }
  });

});
