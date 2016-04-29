$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    built: function () {

      QUnit.test('methods#getData', function (assert) {
        var data = $image.cropper('getData');

        assert.ok(isNumber(data.x));
        assert.ok(isNumber(data.y));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

    }
  });

});
