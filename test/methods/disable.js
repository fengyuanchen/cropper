$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');
      var options = cropper.options;

      $image.cropper('disable');

      QUnit.test('methods#disable', function (assert) {
        assert.equal(cropper.disabled, true);
        assert.ok(cropper.$cropper.hasClass('cropper-disabled'));
      });

      QUnit.test('methods#disable: setAspectRatio', function (assert) {
        $image.cropper('setAspectRatio', 1.618);
        assert.ok(isNaN(options.aspectRatio));
        assert.notEqual(options.aspectRatio, 1.618);
      });

      QUnit.test('methods#disable: move', function (assert) {
        var imageData = $image.cropper('getImageData');

        $image.cropper('move', 10, 10);
        assert.deepEqual($image.cropper('getImageData'), imageData);
      });

      QUnit.test('methods#disable: zoom', function (assert) {
        var ratio = cropper.image.ratio;

        $image.cropper('zoom', 0.5);
        assert.equal(cropper.image.ratio, ratio);
      });

      QUnit.test('methods#disable: rotate', function (assert) {
        var rotate = cropper.image.rotate;

        $image.cropper('rotate', 15);
        assert.equal(cropper.image.rotate, rotate);
      });

      QUnit.test('methods#disable: setCanvasData', function (assert) {
        var canvasData = $image.cropper('getCanvasData');

        $image.cropper('setCanvasData', {
          width: canvasData.width - 160
        });

        assert.deepEqual($image.cropper('getCanvasData'), canvasData);
      });

      QUnit.test('methods#disable: setCropBoxData', function (assert) {
        var cropBoxData = $image.cropper('getCropBoxData');

        $image.cropper('setCropBoxData', {
          height: cropBoxData.height - 90
        });

        assert.deepEqual($image.cropper('getCropBoxData'), cropBoxData);
      });

    }
  });

});
