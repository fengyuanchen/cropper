$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    maxCropBoxWidth: 250,

    built: function () {

      QUnit.test('options#maxCropBoxWidth', function (assert) {
        var data = $image.cropper('setCropBoxData', {
              width: 300
            }).cropper('getCropBoxData');

        assert.ok(Math.round(data.width) <= 250);
      });

    }
  });

});
