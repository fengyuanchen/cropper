$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('methods#enable', function (assert) {
        $image.cropper('disable').cropper('enable');
        assert.equal(cropper.disabled, false);
        assert.ok(!cropper.$cropper.hasClass('cropper-disabled'));
      });

    }
  });

});
