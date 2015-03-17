$(function () {

  'use strict';

  var $image = $(window.createCropperCanvas()),
      isNumber = function (n) {
        return typeof n === 'number' && !isNaN(n);
      };

  $image.cropper({
    built: function () {

      QUnit.test('methods.getContainerData', function (assert) {
        var data = $image.cropper('getContainerData');

        assert.ok($.isPlainObject(data));
        assert.ok(isNumber(data.width));
        assert.ok(isNumber(data.height));
      });

    }
  });

});
