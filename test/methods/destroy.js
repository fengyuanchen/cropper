$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  QUnit.test('methods.destroy: before built', function (assert) {
    $image.cropper();
    assert.ok($image.hasClass('cropper-hidden'));
    assert.ok(typeof $image.data('cropper') === 'object');

    $image.cropper('destroy');
    assert.ok(!$image.hasClass('cropper-hidden'));
    assert.ok(typeof $image.data('cropper') === 'undefined');

    QUnit.test('methods.destroy: after built', function (assert) {
      var done = assert.async();

      $image.cropper({
        built: function () {
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
