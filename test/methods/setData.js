$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    built: function () {
      var _data = $image.cropper('getData');

      QUnit.test('methods.setData', function (assert) {
        var data = $image.cropper('setData', {
              x: 16,
              height: 120
            }).cropper('getData');

        assert.ok(isNumber(data.x));
        assert.ok(isNumber(data.y));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));

        assert.notEqual(data.x, _data.x);
        assert.equal(data.y, _data.y);
        assert.equal(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

      QUnit.test('methods.setData: move', function (assert) {
        var data = $image.cropper('reset').cropper('setData', {
              x: 16,
              y: 9
            }).cropper('getData');

        assert.notEqual(data.x, _data.x);
        assert.notEqual(data.y, _data.y);
        assert.equal(data.width, _data.width);
        assert.equal(data.height, _data.height);
      });


      QUnit.test('methods.setData: resize', function (assert) {
        var data = $image.cropper('reset').cropper('setData', {
              width: 320,
              height: 180
            }).cropper('getData');

        assert.equal(data.x, _data.x);
        assert.equal(data.y, _data.y);
        assert.notEqual(data.width, _data.width);
        assert.notEqual(data.height, _data.height);
      });

    }
  });

});
