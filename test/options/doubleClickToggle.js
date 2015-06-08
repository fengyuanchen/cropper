$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    doubleClickToggle: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.doubleClickToggle', function (assert) {
        cropper.$cropper.trigger('dblclick');
        assert.ok(cropper.$dragBox.hasClass('cropper-crop'));
        assert.equal(cropper.$dragBox.data('drag'), 'crop');
      });

    }
  });

});
