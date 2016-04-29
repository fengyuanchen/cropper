$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('built.cropper', function (e) {

    QUnit.test('events#built', function (assert) {
      assert.equal(e.type, 'built');
      assert.equal(e.namespace, 'cropper');
    });

  }).cropper({
    built: function (e) {

      QUnit.test('options#built', function (assert) {
        assert.equal(e.type, 'built');
        assert.equal(e.namespace, 'cropper');
      });

    }
  });

});
