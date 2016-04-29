$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    modal: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#modal', function (assert) {
        assert.ok(!cropper.$dragBox.hasClass('cropper-modal'));
      });

    }
  });

});
