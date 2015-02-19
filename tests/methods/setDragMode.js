$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper'),
          $canvas = cropper.$canvas;

      QUnit.test('methods.setDragMode', function (assert) {
        assert.equal($canvas.data('directive'), 'crop');
      });

      QUnit.test('methods.setDragMode: move', function (assert) {
        $image.cropper('setDragMode', 'move');
        assert.equal($canvas.data('directive'), 'move');
      });

      QUnit.test('methods.setDragMode: crop', function (assert) {
        $image.cropper('setDragMode', 'crop');
        assert.equal($canvas.data('directive'), 'crop');
      });

    }
  });

});
