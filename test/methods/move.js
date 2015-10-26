$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods.move', function (assert) {
        var canvasData = $image.cropper('getCanvasData');
        var changedCanvasData = $image.cropper('move', 1, 1).cropper('getCanvasData');

        assert.equal(changedCanvasData.left, canvasData.left + 1);
        assert.equal(changedCanvasData.top, canvasData.top + 1);
      });

    }
  });

});
