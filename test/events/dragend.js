$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragend.cropper', function (e) {

    QUnit.test('methods.dragend', function (assert) {
      assert.ok(e.type === 'dragend' && e.namespace === 'cropper');
    });

  }).cropper({
    built: function () {
      var $canvas = $image.parent().find('.cropper-canvas');

       // Triggers events manually when built
      $canvas.trigger('mousedown').trigger('mouseup');
      $canvas.trigger('touchstart').trigger('touchend');
    },

    dragend: function (e) {

      QUnit.test('options.dragend', function (assert) {
        assert.ok(e.type === 'dragend' && e.namespace === 'cropper');
      });

    }
  });

});
