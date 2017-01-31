$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var $image2 = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');
      var canvas = cropper.canvas;
      var _left = canvas.left;
      var _top = canvas.top;

      QUnit.test('options#movable: true', function (assert) {
        $image.cropper('move', 10, 10);
        assert.equal(canvas.left, _left + 10);
        assert.equal(canvas.top, _top + 10);
      });
    }
  });

  $image2.cropper({
    movable: false,

    ready: function () {
      var cropper = $image2.data('cropper');
      var canvas = cropper.canvas;
      var _left = canvas.left;
      var _top = canvas.top;

      QUnit.test('options#movable: false', function (assert) {
        $image2.cropper('move', 10, 10);
        assert.equal(canvas.left, _left);
        assert.equal(canvas.top, _top);
      });
    }
  });

});
