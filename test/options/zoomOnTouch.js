$(function () {

  'use strict';

  var $image = $(window.createCropperImage());
  var pageX = window.innerWidth / 2;
  var pageY = window.innerHeight / 2;

  $image.cropper({
    zoomOnTouch: false,

    built: function () {
      var cropper = $image.data('cropper');
      var _ratio = cropper.image.ratio;

      QUnit.test('options#zoomOnTouch', function (assert) {
        cropper.$cropper.trigger($.Event('touchstart', {
          originalEvent: {
            touches: [
              {
                pageX: pageX,
                pageY: pageY
              },
              {
                pageX: pageX,
                pageY: pageY
              }
            ]
          }
        })).trigger($.Event('touchmove', {
          originalEvent: {
            touches: [
              {
                pageX: pageX - 10,
                pageY: pageY - 10
              },
              {
                pageX: pageX + 10,
                pageY: pageY + 10
              }
            ]
          }
        })).trigger('touchend');

        assert.equal(cropper.image.ratio, _ratio);
      });

    }
  });

});
