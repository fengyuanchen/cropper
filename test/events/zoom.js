$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('zoom.cropper', function (e) {

    QUnit.test('events#zoom', function (assert) {
      assert.equal(e.type, 'zoom');
      assert.ok(e.ratio > e.oldRatio);
    });

  }).cropper({
    ready: function () {
      $image.cropper('zoom', 0.1);
    },

    zoom: function (e) {

      QUnit.test('options#zoom', function (assert) {
        assert.equal(e.type, 'zoom');
        assert.ok(e.ratio > e.oldRatio);
      });

    }
  });

});
