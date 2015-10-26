$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods.getCroppedCanvas', function (assert) {
        var canvas = $image.cropper('getCroppedCanvas');

        assert.ok(canvas instanceof HTMLCanvasElement);
      });

      QUnit.test('methods.getCroppedCanvas: resize', function (assert) {
        var canvas = $image.cropper('getCroppedCanvas', {
              width: 160,
              height: 90
            });

        assert.equal(canvas.width, 160);
        assert.equal(canvas.height, 90);
      });

      QUnit.test('methods.getCroppedCanvas: fillColor', function (assert) {
        var canvas = $image.cropper('rotate', 90).cropper('getCroppedCanvas', {
              fillColor: '#010101'
            });
        var pixelData = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;

        assert.strictEqual(pixelData[0], 1, 'red is 1');
        assert.strictEqual(pixelData[1], 1, 'green is 1');
        assert.strictEqual(pixelData[2], 1, 'blue is 1');
        assert.strictEqual(pixelData[3], 255, 'color is opaque');

      });

    }
  });

});
