$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    built: function () {
      var _data = $image.cropper('getCanvasData');

      QUnit.test('methods#setCanvasData', function (assert) {
        var data = $image.cropper('setCanvasData', {
              left: 16,
              height: 120
            }).cropper('getCanvasData');

        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));

        assert.notEqual(data.left, _data.left);
        assert.notEqual(data.height, _data.height);
      });

      QUnit.test('methods#setCanvasData: move', function (assert) {
        var data = $image.cropper('reset').cropper('setCanvasData', {
              left: 16,
              top: 9
            }).cropper('getCanvasData');

        assert.notEqual(data.left, _data.left);
        assert.notEqual(data.top, _data.top);
      });


      QUnit.test('methods#setCanvasData: resize', function (assert) {
        var data = $image.cropper('reset').cropper('setCanvasData', {
              width: 320,
              height: 180
            }).cropper('getCanvasData');

        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

    }
  });

});
