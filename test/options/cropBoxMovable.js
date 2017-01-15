$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    cropBoxMovable: false,

    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#cropBoxMovable', function (assert) {
        assert.notEqual(cropper.$cropper.find('.cropper-face').data('action'), 'all');
      });

    }
  });

});
