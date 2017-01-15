$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {

      QUnit.test('methods#zoomTo', function (assert) {
        var imageData = $image.cropper('zoomTo', 1).cropper('getImageData');
        var canvasData = $image.cropper('getCanvasData');

        assert.equal(imageData.width, imageData.naturalWidth);
        assert.equal(canvasData.width, canvasData.naturalWidth);
        assert.equal(canvasData.naturalWidth, imageData.naturalWidth);
      });

    }
  });

});
