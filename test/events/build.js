$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('build.cropper', function (e) {

    QUnit.test('methods.build', function (assert) {
      assert.ok(e.type === 'build' && e.namespace === 'cropper');
    });

    e.preventDefault();

    QUnit.test('methods.build: prevent default', function (assert) {
      assert.ok(e.isDefaultPrevented());
    });

  }).one('built.cropper', function (e) {

    QUnit.test('methods.build: default prevented', function (assert) {
      assert.ok(e.type !== 'built');
    });

  }).cropper({
    build: function (e) {

      QUnit.test('options.build', function (assert) {
        assert.ok(e.type === 'build' && e.namespace === 'cropper');
      });

      e.preventDefault();

      QUnit.test('options.build: prevent default', function (assert) {
        assert.ok(e.isDefaultPrevented());
      });

    },

    built: function (e) {

      QUnit.test('options.build: default prevented', function (assert) {
        assert.ok(e.type !== 'built');
      });

    }
  });

});
