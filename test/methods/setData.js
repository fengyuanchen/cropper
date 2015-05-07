$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      isNumber = function (n) {
        return typeof n === 'number' && !isNaN(n);
      };

  $image.cropper({
    built: function () {
      var _data = $image.cropper('getData');

      QUnit.test('methods.setData', function (assert) {
        var data = $image.cropper('setData', {
              left: 16,
              height: 120
            }).cropper('getData');

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));

        assert.notEqual(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.equal(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

      QUnit.test('methods.setData: move', function (assert) {
        var data = $image.cropper('reset').cropper('setData', {
              left: 16,
              top: 9
            }).cropper('getData');

        assert.notEqual(data.left, _data.left);
        assert.notEqual(data.top, _data.top);
        assert.equal(data.width, _data.width);
        assert.equal(data.height, _data.height);
      });


      QUnit.test('methods.setData: resize', function (assert) {
        var data = $image.cropper('reset').cropper('setData', {
              width: 320,
              height: 180
            }).cropper('getData');

        assert.equal(data.left, _data.left);
        assert.equal(data.top, _data.top);
        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

    }
  });

});
