$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods#zoom', function (assert) {
        var canvasData = $image.cropper('getCanvasData');
        var changedCanvasData = $image.cropper('zoom', 0.1).cropper('getCanvasData');

        assert.ok(changedCanvasData.width > canvasData.width);
        assert.ok(changedCanvasData.height > canvasData.height);
      });

    }
  });

});
