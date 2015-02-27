$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      original = $image.attr('src');

  $image.one('built.cropper', function () {

    QUnit.test('methods.replace', function (assert) {
      var done = assert.async();

      $image.one('built.cropper', function () {
        assert.notEqual($image.attr('src'), original);
        done();
      }).cropper('replace', '../assets/img/picture-2.jpg');

    });

  }).cropper();

});
