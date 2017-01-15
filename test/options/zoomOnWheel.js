$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');

      cropper.$cropper.trigger($.Event('wheel', {
        deltaY: 1
      }));
    },

    zoom: function () {
      QUnit.test('options#zoomOnWheel: true', function (assert) {
        assert.ok(true);
      });
    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      zoomOnWheel: false,

      ready: function () {
        var cropper = $image.data('cropper');

        cropper.$cropper.trigger($.Event('wheel', {
          deltaY: 1
        }));
      },

      zoom: function () {
        QUnit.test('options#zoomOnWheel: false', function (assert) {
          assert.ok(false);
        });
      }
    });
  })();

});
