$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      QUnit.test('methods#setDragMode', function (assert) {
        assert.equal($dragBox.data('action'), 'crop');
      });

      QUnit.test('methods#setDragMode: move', function (assert) {
        $image.cropper('setDragMode', 'move');
        assert.equal($dragBox.data('action'), 'move');
      });

      QUnit.test('methods#setDragMode: crop', function (assert) {
        $image.cropper('setDragMode', 'crop');
        assert.equal($dragBox.data('action'), 'crop');
      });

    }
  });

});
