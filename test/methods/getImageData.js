$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      isNumber = function (n) {
        return typeof n === 'number' && !isNaN(n);
      };

  $image.cropper({
    built: function () {

      QUnit.test('methods.getImageData', function (assert) {
        var data = $image.cropper('getImageData');

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

      QUnit.test('methods.getImageData: all', function (assert) {
        var data = $image.cropper('getImageData', true);

        // Not rotate
        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.naturalWidth));
        assert.ok(isNumber(data.naturalHeight));
        assert.ok(isNumber(data.aspectRatio));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
        assert.ok(isNumber(data.rotate));
        assert.ok(isNumber(data.rotatedLeft) && data.rotatedLeft === data.left);
        assert.ok(isNumber(data.rotatedTop) && data.rotatedTop === data.top);
        assert.ok(isNumber(data.rotatedWidth) && data.rotatedWidth === data.width);
        assert.ok(isNumber(data.rotatedHeight) && data.rotatedHeight === data.height);
      });

      QUnit.test('methods.getImageData: all (rotated)', function (assert) {
        var data = $image.cropper('rotate', 45).cropper('getImageData', true);

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.naturalWidth));
        assert.ok(isNumber(data.naturalHeight));
        assert.ok(isNumber(data.aspectRatio));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
        assert.ok(isNumber(data.rotate));
        assert.ok(isNumber(data.rotatedLeft) && data.rotatedLeft !== data.left);
        assert.ok(isNumber(data.rotatedTop) && data.rotatedTop !== data.top);
        assert.ok(isNumber(data.rotatedWidth) && data.rotatedWidth !== data.width);
        assert.ok(isNumber(data.rotatedHeight) && data.rotatedHeight !== data.height);
      });

    }
  });

});
