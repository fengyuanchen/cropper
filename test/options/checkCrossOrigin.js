$(function () {

  'use strict';

  var crossOriginImage = 'http://fengyuanchen.github.io/cropper/img/picture.jpg';
  var $image = $(window.createCropperImage({
        src: crossOriginImage
      }));

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options#checkCrossOrigin: true', function (assert) {
        assert.ok(cropper.$clone.attr('crossOrigin') === 'anonymous');
        assert.ok(cropper.$clone.attr('src').indexOf('timestamp') !== -1);
      });

    }
  });

  (function () {
    var $image = $(window.createCropperImage({
          src: crossOriginImage
        }));

    $image.cropper({
      checkCrossOrigin: false,

      built: function () {
        var cropper = $image.data('cropper');

        QUnit.test('options#checkCrossOrigin: false', function (assert) {
          assert.ok(cropper.$clone.attr('crossOrigin') === undefined);
          assert.ok(cropper.$clone.attr('src').indexOf('timestamp') === -1);
        });

      }
    });
  })();

  (function () {
    var $image = $(window.createCropperImage({
          src: crossOriginImage,
          crossOrigin: 'anonymous'
        }));

    $image.cropper({
      built: function () {
        var cropper = $image.data('cropper');

        QUnit.test('options#checkCrossOrigin: exists crossOrigin attribute', function (assert) {
          assert.ok(cropper.$clone.attr('crossOrigin') === 'anonymous');
          assert.ok(cropper.$clone.attr('src').indexOf('timestamp') === -1);
        });

      }
    });
  })();

});
