$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('build.cropper', function (e) {

    QUnit.test('events.build', function (assert) {
      assert.equal(e.type, 'build');
      assert.equal(e.namespace, 'cropper');
    });

    e.preventDefault();

  }).one('built.cropper', function () {

    QUnit.test('events.build: default prevented', function (assert) {
      assert.ok(false);
    });

  }).cropper({
    build: function (e) {

      QUnit.test('options.build', function (assert) {
        assert.equal(e.type, 'build');
        assert.equal(e.namespace, 'cropper');
      });

      e.preventDefault();

    },

    built: function () {

      QUnit.test('options.build: default prevented', function (assert) {
        assert.ok(false);
      });

    }
  });

});
