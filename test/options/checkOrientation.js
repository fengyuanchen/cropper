$(function () {

  'use strict';

  QUnit.test('options#checkOrientation: true', function (assert) {
    var done = assert.async();
    var $image = $(window.createCropperImage({
          src: '../docs/images/picture-3.jpg'
        }));

    $image.cropper({
      ready: function () {
        var data = $(this).cropper('getData');

        assert.notEqual(data.rotate, 0);
        done();
      }
    });
  });

  QUnit.test('options#checkOrientation: false', function (assert) {
    var done = assert.async();
    var $image = $(window.createCropperImage({
          src: '../docs/images/picture-3.jpg'
        }));

    $image.cropper({
      checkOrientation: false,

      ready: function () {
        var data = $(this).cropper('getData');

        assert.equal(data.rotate, 0);
        done();
      }
    });
  });

});
