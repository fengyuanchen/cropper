$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    strict: false,

    built: function () {
      var canvasData = $image.cropper('getCanvasData'),
          cropBoxData = $image.cropper('getCropBoxData');

      QUnit.test('methods.reset', function (assert) {
        $image.cropper('setCanvasData', {
          top: canvasData.top + 10,
          width: canvasData.width - 10
        });

        assert.notDeepEqual($image.cropper('getCanvasData'), canvasData);

        $image.cropper('setCropBoxData', {
          left: cropBoxData.left + 10,
          height: cropBoxData.height - 10
        });

        assert.notDeepEqual($image.cropper('getCropBoxData'), cropBoxData);

        $image.cropper('reset');
        assert.deepEqual($image.cropper('getCanvasData'), canvasData);
        assert.deepEqual($image.cropper('getCropBoxData'), cropBoxData);
      });

    }
  });

});
