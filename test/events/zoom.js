$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('zoom.cropper', function (e) {

    QUnit.test('events.zoom', function (assert) {
      assert.equal(e.type, 'zoom');
      assert.equal(e.namespace, 'cropper');

      if (e.ratio > 0) {
        assert.equal(e.ratio, 0.1);
      } else {
        assert.equal(e.ratio, -0.1);
      }
    });

  }).cropper({
    built: function () {
      $image.cropper('zoom', 0.1).cropper('zoom', -0.1);
    },

    zoom: function (e) {

      QUnit.test('options.zoom', function (assert) {
        assert.equal(e.type, 'zoom');
        assert.equal(e.namespace, 'cropper');

        if (e.ratio > 0) {
          assert.equal(e.ratio, 0.1);
        } else {
          assert.equal(e.ratio, -0.1);
        }
      });

    }
  });

});
