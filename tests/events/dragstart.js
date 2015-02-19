$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragstart.cropper', function (e) {

    QUnit.test('methods.dragstart', function (assert) {
      assert.ok(e.type === 'dragstart' && e.namespace === 'cropper');
    });

  }).cropper({
    built: function () {
      var $canvas = $image.parent().find('.cropper-canvas');

       // Triggers events manually when built
      $canvas.trigger('mousedown').trigger('mouseup');
      $canvas.trigger('touchstart').trigger('touchend');
    },

    dragstart: function (e) {

      QUnit.test('options.dragstart', function (assert) {
        assert.ok(e.type === 'dragstart' && e.namespace === 'cropper');
      });

    }
  });

});
