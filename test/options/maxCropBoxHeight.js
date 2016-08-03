$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    maxCropBoxHeight: 250,

    built: function () {

      QUnit.test('options#maxCropBoxHeight', function (assert) {
        var data = $image.cropper('setCropBoxData', {
              height: 300
            }).cropper('getCropBoxData');

        assert.ok(Math.round(data.height) <= 250);
      });

    }
  });

});
