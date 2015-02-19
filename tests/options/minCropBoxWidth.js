$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    minCropBoxWidth: 300,

    built: function () {

      QUnit.test('options.minCropBoxWidth', function (assert) {
        var data = $image.cropper('setCropBoxData', {
              width: 250
            }).cropper('getCropBoxData');

        assert.ok(Math.round(data.width) === 300);
      });

    }
  });

});
