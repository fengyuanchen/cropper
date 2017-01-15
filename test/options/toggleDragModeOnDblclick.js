$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    ready: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#toggleDragModeOnDblclick: true', function (assert) {
        cropper.$cropper.trigger('dblclick');
        assert.ok(cropper.$dragBox.hasClass('cropper-move'));
        assert.equal(cropper.$dragBox.data('action'), 'move');
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage());

    $image.cropper({
      toggleDragModeOnDblclick: false,

      ready: function () {
        var cropper = $image.data('cropper');

        QUnit.test('options#toggleDragModeOnDblclick: false', function (assert) {
          cropper.$cropper.trigger('dblclick');
          assert.ok(cropper.$dragBox.hasClass('cropper-crop'));
          assert.equal(cropper.$dragBox.data('action'), 'crop');
        });

      }
    });
  })();

});
