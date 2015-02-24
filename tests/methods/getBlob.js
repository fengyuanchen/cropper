$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      // Skip tests when testing in a browser that doesn't have toBlob
      var canvas = document.createElement('canvas'),
          test = canvas.toBlob ? QUnit.test : QUnit.skip;

      test('methods.getBlob', function (assert) {
        var done = assert.async();
        $image.cropper('getBlob')
          .then(function (blob) {
            assert.strictEqual(blob.type, 'image/png');
            done();
          })
          .fail(function () {
            assert.ok(false, 'getBlob failed');
            done();
          });
      });

      test('methods.getBlob: jpg', function (assert) {
        var done = assert.async();
        $image.cropper('getBlob', 'image/jpeg')
          .then(function (blob) {
            assert.strictEqual(blob.type, 'image/jpeg');
            done();
          })
          .fail(function () {
            assert.ok(false, 'getBlob failed');
            done();
          });
      });

      test('methods.getBlob: resize', function (assert) {
        var done = assert.async();
        $image.cropper('getBlob', {
              width: 160,
              height: 90
            })
            .then(function (blob) {
              var blobURL = URL.createObjectURL(blob);
              $('<img src="' + blobURL + '">').one('load', function () {
                assert.equal(this.width, 160);
                assert.equal(this.height, 90);
                done();
              });
            })
            .fail(function () {
              assert.ok(false, 'getBlob failed');
              done();
            });
      });

    }
  });

});
