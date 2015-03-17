$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('zoomin.cropper', function (e) {

    QUnit.test('methods.zoomin', function (assert) {
      assert.ok(e.type === 'zoomin' && e.namespace === 'cropper');
    });

  }).cropper({
    zoomin: function (e) {

      QUnit.test('options.zoomin', function (assert) {
        assert.ok(e.type === 'zoomin' && e.namespace === 'cropper');
      });

    }
  });

});
