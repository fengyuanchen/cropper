$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('ready', function (e) {

    QUnit.test('events#ready', function (assert) {
      assert.equal(e.type, 'ready');
    });

  }).cropper({
    ready: function (e) {

      QUnit.test('options#ready', function (assert) {
        assert.equal(e.type, 'ready');
      });

    }
  });

});
