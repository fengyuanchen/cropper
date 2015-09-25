$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    built: function () {

      QUnit.test('methods.getImageData', function (assert) {
        var data = $image.cropper('getImageData');

        // Not rotate
        assert.ok(isNumber(data.naturalWidth));
        assert.ok(isNumber(data.naturalHeight));
        assert.ok(isNumber(data.aspectRatio));
        assert.ok(isNumber(data.left));
        assert.ok(isNumber(data.top));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

    }
  });

});
