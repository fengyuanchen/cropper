$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('zoomout.cropper', function (e) {

    QUnit.test('methods.zoomout', function (assert) {
      assert.ok(e.type === 'zoomout' && e.namespace === 'cropper');
    });

  }).cropper({
    zoomout: function (e) {

      QUnit.test('options.zoomout', function (assert) {
        assert.ok(e.type === 'zoomout' && e.namespace === 'cropper');
      });

    }
  });

});
