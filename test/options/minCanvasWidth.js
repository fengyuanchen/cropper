$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      minCanvasWidth = 160;

  $image.cropper({
    strict: false,
    minCanvasWidth: minCanvasWidth,

    built: function () {

      QUnit.test('options.minCanvasWidth', function (assert) {
        var data = $image.cropper('setCanvasData', {
              width: 80
            }).cropper('getCanvasData');

        assert.ok(Math.round(data.width) === minCanvasWidth);
      });

    }
  });

});
