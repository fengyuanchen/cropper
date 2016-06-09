$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var $image2 = $(window.createCropperImage());
  var $image3 = $(window.createCropperImage());

  $image.cropper({
    fitCanvasToContainer: true,

    built: function () {
      QUnit.test('options#fitCanvasToContainer: true', function (assert) {
        $image.cropper('rotate', 90);

        var canvasData = $image.cropper('getCanvasData');
        var containerData = $image.cropper('getContainerData');

        assert.ok(parseInt(canvasData.height, 10) <= parseInt(containerData.height, 10));
        assert.ok(parseInt(canvasData.width, 10) <= parseInt(containerData.width, 10));
      });

    }
  });

  $image2.cropper({
    built: function () {
      QUnit.test('options#fitCanvasToContainer: false', function (assert) {
        $image2.cropper('rotate', 90);

        var canvasData = $image.cropper('getCanvasData');
        var containerData = $image.cropper('getContainerData');

        assert.ok(parseInt(canvasData.height, 10) >= parseInt(containerData.height, 10));
      });

    }
  });

  $image3.cropper({
    fitCanvasToContainer: true,

    built: function () {
      QUnit.test('options#fitCanvasToContainer: true with options#zoomable: true', function (assert) {
        $image3.cropper('rotate', 90);
        $image3.cropper('zoom', 200);

        var canvasData = $image.cropper('getCanvasData');
        var containerData = $image.cropper('getContainerData');

        assert.ok(parseInt(canvasData.height, 10) <= parseInt(containerData.height, 10));
        assert.ok(parseInt(canvasData.width, 10) <= parseInt(containerData.width, 10));
      });

    }
  });

});
