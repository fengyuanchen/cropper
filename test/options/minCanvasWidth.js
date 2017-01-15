$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var minCanvasWidth = 160;

  $image.cropper({
    minCanvasWidth: minCanvasWidth,

    ready: function () {

      QUnit.test('options#minCanvasWidth', function (assert) {
        var data = $image.cropper('setCanvasData', {
              width: 80
            }).cropper('getCanvasData');

        assert.ok(Math.round(data.width) === minCanvasWidth);
      });

    }
  });

});
