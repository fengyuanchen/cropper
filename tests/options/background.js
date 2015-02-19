$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    background: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.background', function (assert) {
        assert.ok(!cropper.$cropper.hasClass('cropper-bg'));
      });

    }
  });

});
