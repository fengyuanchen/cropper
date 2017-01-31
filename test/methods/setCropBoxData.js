$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    ready: function () {
      var _data = $image.cropper('getCropBoxData');

      QUnit.test('methods#setCropBoxData', function (assert) {
        var data = $image.cropper('setCropBoxData', {
              left: 16,
              height: 120
            }).cropper('getCropBoxData');

        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));

        assert.notEqual(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.equal(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

      QUnit.test('methods#setCropBoxData: move', function (assert) {
        var data = $image.cropper('reset').cropper('setCropBoxData', {
              left: 16,
              top: 9
            }).cropper('getCropBoxData');

        assert.notEqual(data.left, _data.left);
        assert.notEqual(data.top, _data.top);
        assert.equal(data.width, _data.width);
        assert.equal(data.height, _data.height);
      });


      QUnit.test('methods#setCropBoxData: resize', function (assert) {
        var data = $image.cropper('reset').cropper('setCropBoxData', {
              width: 320,
              height: 180
            }).cropper('getCropBoxData');

        assert.equal(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

    }
  });

});
