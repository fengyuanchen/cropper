$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('built.cropper', function (e) {

    QUnit.test('methods.built', function (assert) {
      assert.ok(e.type === 'built' && e.namespace === 'cropper');
    });

  }).cropper({
    built: function (e) {

      QUnit.test('options.built', function (assert) {
        assert.ok(e.type === 'built' && e.namespace === 'cropper');
      });

    }
  });

});
