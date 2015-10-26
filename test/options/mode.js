$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      QUnit.test('options.mode: 0', function (assert) {
        var canvasData = {
              left: 100,
              top: 100,
              width: 160,
              height: 90
            };
        var changedCanvasData = $image.cropper('setCanvasData', canvasData).cropper('getCanvasData');

        assert.equal(changedCanvasData.left, canvasData.left);
        assert.equal(changedCanvasData.top, canvasData.top);
        assert.equal(changedCanvasData.width, canvasData.width);
        assert.equal(changedCanvasData.height, canvasData.height);
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      mode: 1,

      built: function () {


        QUnit.test('options.mode: 1', function (assert) {
          var canvasData = $image.cropper('zoom', -0.5).cropper('getCanvasData');
          var cropBoxData = $image.cropper('getCropBoxData');

          assert.ok(canvasData.width >= cropBoxData.width);
          assert.ok(canvasData.height >= cropBoxData.height);
        });

      }
    });
  })();

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      mode: 2,

      built: function () {
        QUnit.test('options.mode: 2', function (assert) {
          var canvasData = $image.cropper('zoom', -0.5).cropper('getCanvasData');
          var containerData = $image.cropper('getContainerData');

          assert.ok(canvasData.width >= containerData.width || canvasData.height >= containerData.height);
        });

      }
    });
  })();

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      mode: 3,

      built: function () {
        QUnit.test('options.mode: 3', function (assert) {
          var canvasData = $image.cropper('zoom', -0.5).cropper('getCanvasData');
          var containerData = $image.cropper('getContainerData');

          assert.ok(canvasData.width >= containerData.width);
          assert.ok(canvasData.height >= containerData.height);
        });

      }
    });
  })();

});
