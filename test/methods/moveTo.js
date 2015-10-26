$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods.moveTo', function (assert) {
        var canvasData = $image.cropper('moveTo', 0, 0).cropper('getCanvasData');

        assert.equal(canvasData.left, 0);
        assert.equal(canvasData.top, 0);
      });

    }
  });

});
