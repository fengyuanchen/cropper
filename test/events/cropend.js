$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('cropend.cropper', function (e) {

    QUnit.test('events.cropend', function (assert) {
      assert.equal(e.type, 'cropend');
      assert.equal(e.namespace, 'cropper');
      assert.equal(e.action, 'crop');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mouseup');
    },

    cropend: function (e) {

      QUnit.test('options.cropend', function (assert) {
        assert.equal(e.type, 'cropend');
        assert.equal(e.namespace, 'cropper');
        assert.equal(e.action, 'crop');
      });

    }
  });

});
