$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      cropper.$cropper.trigger($.Event('wheel', {
        originalEvent: {
          deltaY: 1
        }
      }));
    },

    zoom: function () {
      QUnit.test('options.zoomOnWheel: true', function (assert) {
        assert.ok(true);
      });
    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      zoomOnWheel: false,

      built: function () {
        var cropper = $image.data('cropper');

        cropper.$cropper.trigger($.Event('wheel', {
          originalEvent: {
            deltaY: 1
          }
        }));
      },

      zoom: function () {
        QUnit.test('options.zoomOnWheel: false', function (assert) {
          assert.ok(false);
        });
      }
    });
  })();

});
