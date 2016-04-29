$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#dragMode: crop', function (assert) {
        assert.equal(cropper.$dragBox.data('action'), 'crop');
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      dragMode: 'move',

      built: function () {
        var cropper = $image.data('cropper');

        QUnit.test('options#dragMode: move', function (assert) {
          assert.equal(cropper.$dragBox.data('action'), 'move');
        });

      }
    });
  })();

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      dragMode: 'none',

      built: function () {
        var cropper = $image.data('cropper');

        QUnit.test('options#dragMode: none', function (assert) {
          assert.equal(cropper.$dragBox.data('action'), 'none');
        });

      }
    });
  })();

});
