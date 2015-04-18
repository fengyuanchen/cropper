$(function () {

  'use strict';

  var crossOriginImage = 'http://fengyuanchen.github.io/cropper/img/picture.jpg',
      $image = $(window.createCropperImage({
        src: crossOriginImage
      })),
      $image2 = $(window.createCropperImage({
        src: crossOriginImage,
        crossOrigin: 'anonymous'
      }));

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.checkImageOrigin', function (assert) {
        assert.ok(cropper.$clone.attr('crossOrigin') === 'anonymous');
        assert.ok(cropper.$clone.attr('src').indexOf('timestamp') !== -1);
      });

    }
  });

  $image2.cropper({
    built: function () {
      var cropper = $image2.data('cropper');

      QUnit.test('options.checkImageOrigin: exists crossOrigin attribute', function (assert) {
        assert.ok(cropper.$clone.attr('crossOrigin') === 'anonymous');
        assert.ok(cropper.$clone.attr('src').indexOf('timestamp') === -1);
      });

    }
  });

});
