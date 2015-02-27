$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragmove.cropper', function (e) {

    QUnit.test('methods.dragmove', function (assert) {
      assert.ok(e.type === 'dragmove' && e.namespace === 'cropper');
    });

  }).cropper({
    built: function () {
      var $canvas = $image.parent().find('.cropper-canvas');

       // Triggers events manually when built
      $canvas.trigger('mousedown').trigger('mousemove').trigger('mouseup');
      $canvas.trigger('touchstart').trigger('touchmove').trigger('touchend');
    },

    dragmove: function (e) {

      QUnit.test('options.dragmove', function (assert) {
        assert.ok(e.type === 'dragmove' && e.namespace === 'cropper');
      });

    }
  });

});
