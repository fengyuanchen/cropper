$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    movable: false,

    built: function () {
      var cropper = $image.data('cropper'),
          canvas = cropper.canvas,
          _left = canvas.left,
          _top = canvas.top;

      QUnit.test('options.movable', function (assert) {
        $image.cropper('move', 10, 10);
        assert.equal(canvas.left, _left);
        assert.equal(canvas.top, _top);
      });
    }
  });

});
