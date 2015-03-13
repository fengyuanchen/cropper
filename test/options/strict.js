$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var canvasData = $image.cropper('getCanvasData');

      QUnit.test('options.strict: true', function (assert) {
        $image.cropper('zoom', -0.5); // Zoom out
        assert.deepEqual($image.cropper('getCanvasData'), canvasData);
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      strict: false,

      built: function () {
        var canvasData = {
              left: 100,
              top: 100,
              width: 160,
              height: 90
            };

        QUnit.test('options.strict: false', function (assert) {
          $image.cropper('setCanvasData', canvasData);
          assert.deepEqual($image.cropper('getCanvasData'), canvasData);
        });

      }
    });
  })();

});
