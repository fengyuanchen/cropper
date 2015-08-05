$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    mouseWheelZoom: false,

    built: function () {
      var cropper = $image.data('cropper');
      var _ratio = cropper.image.ratio;

      QUnit.test('options.mouseWheelZoom', function (assert) {
        cropper.$cropper.trigger($.Event('wheel', {
          originalEvent: {
            wheelDelta: -120
          }
        }));

        assert.equal(cropper.image.ratio, _ratio);
      });

    }
  });

});
