$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('cropmove.cropper', function (e) {

    QUnit.test('events.cropmove', function (assert) {
      assert.equal(e.type, 'cropmove');
      assert.equal(e.namespace, 'cropper');
      assert.equal(e.action, 'crop');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mousemove').trigger('mouseup');
    },

    cropmove: function (e) {

      QUnit.test('options.cropmove', function (assert) {
        assert.equal(e.type, 'cropmove');
        assert.equal(e.namespace, 'cropper');
        assert.equal(e.action, 'crop');
      });

    }
  });

});
