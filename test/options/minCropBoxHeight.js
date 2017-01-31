$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    minCropBoxHeight: 150,

    ready: function () {

      QUnit.test('options#minCropBoxHeight', function (assert) {
        var data = $image.cropper('setCropBoxData', {
              height: 100
            }).cropper('getCropBoxData');

        assert.ok(Math.round(data.height) === 150);
      });

    }
  });

});
