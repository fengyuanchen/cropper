$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.one('built.cropper', function () {

    QUnit.test('methods#replace', function (assert) {
      var done = assert.async();

      $image.one('built.cropper', function () {
        assert.ok(true);
        done();
      }).cropper('replace', '../assets/img/picture-2.jpg');

    });

  }).cropper();

});
