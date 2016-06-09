$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var $image2 = $(window.createCropperImage());

  $image.cropper({
    fitCanvasToContainer: true,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#fitCanvasToContainer: true', function (assert) {
        $image.cropper('rotate', 90);

        var canvasData = $image.cropper('getCanvasData');
        var containerData = $image.cropper('getContainerData');

        assert.ok(parseInt(canvasData.height, 10) <= parseInt(containerData.height, 10))
        assert.ok(parseInt(canvasData.width, 10) <= parseInt(containerData.width, 10))
      });

    }
  });

  $image2.cropper({
    built: function () {
      var cropper = $image2.data('cropper');

      QUnit.test('options#fitCanvasToContainer: false', function (assert) {
        $image2.cropper('rotate', 90);

        var canvasData = $image.cropper('getCanvasData');
        var containerData = $image.cropper('getContainerData');

        assert.ok(parseInt(canvasData.height, 10) >= parseInt(containerData.height, 10))
      });

    }
  });

});
