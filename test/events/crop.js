$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  $image.on('crop.cropper', function (e) {

    QUnit.test('events#crop', function (assert) {
      assert.equal(e.type, 'crop');
      assert.equal(e.namespace, 'cropper');
      assert.ok(isNumber(e.x));
      assert.ok(isNumber(e.y));
      assert.ok(isNumber(e.width));
      assert.ok(isNumber(e.height));
      assert.ok(isNumber(e.rotate));
      assert.ok(isNumber(e.scaleX));
      assert.ok(isNumber(e.scaleY));
    });

  }).cropper({
    built: function () {
      var $dragBox = $image.data('cropper').$dragBox;

      // Triggers events manually when built
      $dragBox.trigger('mousedown').trigger('mousemove').trigger('mouseup');
    },

    crop: function (e) {

      QUnit.test('options#crop', function (assert) {
        assert.equal(e.type, 'crop');
        assert.equal(e.namespace, 'cropper');
        assert.ok(isNumber(e.x));
        assert.ok(isNumber(e.y));
        assert.ok(isNumber(e.width));
        assert.ok(isNumber(e.height));
        assert.ok(isNumber(e.rotate));
        assert.ok(isNumber(e.scaleX));
        assert.ok(isNumber(e.scaleY));
      });

    }
  });

});
