$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    zoomable: false,

    ready: function () {
      var cropper = $image.data('cropper');
      var _ratio = cropper.image.ratio;

      QUnit.test('options#zoomable', function (assert) {
        $image.cropper('zoom', 1);

        assert.equal(cropper.image.ratio, _ratio);
      });

    }
  });

});
