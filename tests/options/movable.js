$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    movable: false,

    built: function () {
      var cropper = $image.data('cropper'),
          cropBox = cropper.cropBox,
          _left = cropBox.left,
          _top = cropBox.top;

      QUnit.test('methods.move', function (assert) {

        $image.cropper('move', 10, 10);

        assert.equal(cropBox.left, _left);
        assert.equal(cropBox.top, _top);
      });

      QUnit.test('options.movable', function (assert) {
        assert.notEqual(cropper.$cropper.find('.cropper-face').data('directive'), 'all');
      });

    }
  });

});
