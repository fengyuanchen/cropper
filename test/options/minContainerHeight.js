$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var minContainerHeight = 361;

  $image.cropper({
    minContainerHeight: minContainerHeight,

    ready: function () {
      var cropper = $image.data('cropper');
      var container = cropper.container;

      QUnit.test('options#minContainerHeight', function (assert) {
        assert.ok(Math.round(container.height) === minContainerHeight);
      });

    }
  });

});
