$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('cropstart.cropper', function (e) {

    QUnit.test('events#cropstart', function (assert) {
      assert.equal(e.type, 'cropstart');
      assert.equal(e.namespace, 'cropper');
      assert.equal(e.action, 'crop');
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mouseup');
    },

    cropstart: function (e) {

      QUnit.test('options#cropstart', function (assert) {
        assert.equal(e.type, 'cropstart');
        assert.equal(e.namespace, 'cropper');
        assert.equal(e.action, 'crop');
      });

    }
  });

});
