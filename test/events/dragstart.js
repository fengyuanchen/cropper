$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('dragstart.cropper', function (e) {

    QUnit.test('methods.dragstart', function (assert) {
      assert.equal(e.type, 'dragstart');
      assert.equal(e.namespace, 'cropper');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mouseup');
    },

    dragstart: function (e) {

      QUnit.test('options.dragstart', function (assert) {
        assert.equal(e.type, 'dragstart');
        assert.equal(e.namespace, 'cropper');
      });

    }
  });

});
