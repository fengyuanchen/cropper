$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.on('cropmove.cropper', function (e) {

    QUnit.test('events#cropmove', function (assert) {
      assert.equal(e.type, 'cropmove');
      assert.equal(e.action, 'crop');
    });

  }).cropper({
    ready: function () {
      var PonterEvent = window.PonterEvent;
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when ready
      $dragBox.trigger(PonterEvent ? 'pointerdown' : 'mousedown')
        .trigger(PonterEvent ? 'pointermove' : 'mousemove')
        .trigger(PonterEvent ? 'pointerup' : 'mouseup');
    },

    cropmove: function (e) {

      QUnit.test('options#cropmove', function (assert) {
        assert.equal(e.type, 'cropmove');
        assert.equal(e.action, 'crop');
      });

    }
  });

});
