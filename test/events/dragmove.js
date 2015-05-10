$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragmove.cropper', function (e) {

    QUnit.test('methods.dragmove', function (assert) {
      assert.equal(e.type, 'dragmove');
      assert.equal(e.namespace, 'cropper');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mousemove').trigger('mouseup');
    },

    dragmove: function (e) {

      QUnit.test('options.dragmove', function (assert) {
        assert.equal(e.type, 'dragmove');
        assert.equal(e.namespace, 'cropper');
      });

    }
  });

});
