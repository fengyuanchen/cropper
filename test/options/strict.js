$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var canvasData;
      var cropBoxData;

      QUnit.test('options.strict: true', function (assert) {
        $image.cropper('zoom', -0.5); // Zoom out
        canvasData = $image.cropper('getCanvasData');
        cropBoxData = $image.cropper('getCropBoxData');
        assert.ok(canvasData.width >= cropBoxData.width);
        assert.ok(canvasData.height >= cropBoxData.height);
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      strict: false,

      built: function () {
        var _canvasData = {
              left: 100,
              top: 100,
              width: 160,
              height: 90
            };

        QUnit.test('options.strict: false', function (assert) {
          var canvasData = $image.cropper('setCanvasData', _canvasData).cropper('getCanvasData');

          assert.equal(canvasData.left, _canvasData.left);
          assert.equal(canvasData.top, _canvasData.top);
          assert.equal(canvasData.width, _canvasData.width);
          assert.equal(canvasData.height, _canvasData.height);
        });

      }
    });
  })();

});
