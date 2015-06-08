$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('change.cropper', function (e) {

    QUnit.test('methods.change', function (assert) {
      assert.equal(e.type, 'change');
      assert.equal(e.namespace, 'cropper');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mousemove').trigger('mouseup');
    },

    change: function (e) {

      QUnit.test('options.change', function (assert) {
        assert.equal(e.type, 'change');
        assert.equal(e.namespace, 'cropper');
      });

    }
  });

});
