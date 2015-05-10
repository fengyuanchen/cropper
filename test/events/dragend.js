$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragend.cropper', function (e) {

    QUnit.test('methods.dragend', function (assert) {
      assert.equal(e.type, 'dragend');
      assert.equal(e.namespace, 'cropper');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mouseup');
    },

    dragend: function (e) {

      QUnit.test('options.dragend', function (assert) {
        assert.equal(e.type, 'dragend');
        assert.equal(e.namespace, 'cropper');
      });

    }
  });

});
