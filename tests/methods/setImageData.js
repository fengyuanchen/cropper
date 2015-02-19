$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      isNumber = function (n) {
        return typeof n === 'number' && !isNaN(n);
      };

  $image.cropper({
    built: function () {
      var _data = $image.cropper('getImageData');

      QUnit.test('methods.setImageData', function (assert) {
        var data = $image.cropper('setImageData', {
              left: 16,
              height: 120
            }).cropper('getImageData');

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));

        assert.notEqual(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

      QUnit.test('methods.setImageData: move', function (assert) {
        var data = $image.cropper('reset').cropper('setImageData', {
              left: 16,
              top: 9
            }).cropper('getImageData');

        assert.notEqual(data.left, _data.left);
        assert.notEqual(data.top, _data.top);
        assert.equal(data.width, _data.width);
        assert.equal(data.height, _data.height);
      });


      QUnit.test('methods.setImageData: resize', function (assert) {
        var data = $image.cropper('reset').cropper('setImageData', {
              width: 320,
              height: 180
            }).cropper('getImageData');

        assert.equal(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

    }
  });

});
