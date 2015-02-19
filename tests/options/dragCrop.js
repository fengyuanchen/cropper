$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    dragCrop: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.dragCrop', function (assert) {
        assert.notEqual(cropper.$canvas.data('directive'), 'crop');
      });

    }
  });

});
