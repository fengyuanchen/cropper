$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  QUnit.test('methods#destroy: before ready', function (assert) {
    $image.cropper();
    assert.ok(typeof $image.data('cropper') === 'object');

    $image.cropper('destroy');
    assert.ok(typeof $image.data('cropper') === 'undefined');

    QUnit.test('methods#destroy: after ready', function (assert) {
      var done = assert.async();

      $image.cropper({
        ready: function () {
          assert.ok($image.hasClass('cropper-hidden'));
          assert.ok(typeof $image.data('cropper') === 'object');

          $image.cropper('destroy');
          assert.ok(!$image.hasClass('cropper-hidden'));
          assert.ok(typeof $image.data('cropper') === 'undefined');
          done();
        }
      });
    });
  });

});
