$(function () {

  'use strict';

  var $image = $(window.createCropperCanvas()),
      isNumber = function (n) {
        return typeof n === 'number' && !isNaN(n);
      };

  $image.cropper({
    built: function () {

      QUnit.test('methods.getCanvasData', function (assert) {
        var data = $image.cropper('getCanvasData');

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.aspectRatio));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

    }
  });

});
