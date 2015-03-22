$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      minCanvasHeight = 90;

  $image.cropper({
    strict: false,
    minCanvasHeight: minCanvasHeight,

    built: function () {

      QUnit.test('options.minCanvasHeight', function (assert) {
        var data = $image.cropper('setCanvasData', {
              height: 45
            }).cropper('getCanvasData');

        assert.ok(Math.round(data.height) === minCanvasHeight);
      });

    }
  });

});
