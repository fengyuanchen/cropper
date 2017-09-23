$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('cropend.cropper', function (e) {

    QUnit.test('events#cropend', function (assert) {
      assert.equal(e.type, 'cropend');
      assert.equal(e.action, 'crop');
    });

  }).cropper({
    ready: function () {
      var PonterEvent = window.PonterEvent;
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when ready
      $dragBox.trigger(PonterEvent ? 'pointerdown' : 'mousedown')
        .trigger(PonterEvent ? 'pointerup' : 'mouseup');
    },

    cropend: function (e) {

      QUnit.test('options#cropend', function (assert) {
        assert.equal(e.type, 'cropend');
        assert.equal(e.action, 'crop');
      });

    }
  });

});
