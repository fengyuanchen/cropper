$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('ready', function () {

    QUnit.test('methods#replace', function (assert) {
      var done = assert.async();

      $image.one('ready', function () {
        assert.ok(true);
        done();
      }).cropper('replace', '../docs/images/picture-2.jpg');

    });

  }).cropper();

});
