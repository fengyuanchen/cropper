$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.cropper({
    built: function () {

      QUnit.test('methods.getContainerData', function (assert) {
        var data = $image.cropper('getContainerData');

        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

    }
  });

});
