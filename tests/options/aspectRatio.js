$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var cropper = $image.data('cropper'),
          options = cropper.options,
          cropBox = cropper.cropBox;

      QUnit.test('options.aspectRatio: Number', function (assert) {
        var ratios = [NaN, 0, 9, -8 / 7, -6 / 5, -1, -1 / 2, -3 / 4, 1 / 2, 3 / 4, 1, 8 / 7, 6 / 5, 9];

        $.each(ratios, function (i, ratio) {
          var data;

          $image.cropper('setAspectRatio', ratio);

          data = $image.cropper('getCropBoxData');

          if (i === 0 || i === 1) {
            ratio = cropBox.width / cropBox.height;
          }

          assert.ok(data.width / data.height - Math.abs(ratio) < 1 / 1000000000);

        });
      });

      QUnit.test('options.aspectRatio: String', function (assert) {
        var ratios = ['auto', 'a1', '2a', '3', '0'];

        $.each(ratios, function (i, ratio) {

          $image.cropper('setAspectRatio', ratio);

          switch (i) {
            case 0:
            case 1:
            case 4:
              assert.ok(isNaN(options.aspectRatio));
              break;

            case 2:
              assert.equal(options.aspectRatio, 2);
              break;

            case 3:
              assert.equal(options.aspectRatio, 3);
              break;
          }

        });
      });

      QUnit.test('options.aspectRatio: Boolean', function (assert) {
        var ratios = [true, false];

        $.each(ratios, function (i, ratio) {

          $image.cropper('setAspectRatio', ratio);
          assert.ok(isNaN(options.aspectRatio));

        });
      });

      QUnit.test('options.aspectRatio: Object', function (assert) {
        var ratios = [null, {}, { a: 1, b: 2 }];

        $.each(ratios, function (i, ratio) {

          $image.cropper('setAspectRatio', ratio);
          assert.ok(isNaN(options.aspectRatio));

        });
      });

      QUnit.test('options.aspectRatio: Array', function (assert) {
        var ratios = [[], [1], [2, 3], [undefined, 4, 5]];

        $.each(ratios, function (i, ratio) {

          $image.cropper('setAspectRatio', ratio);

          switch (i) {
            case 0:
            case 3:
              assert.ok(isNaN(options.aspectRatio));
              break;

            case 1:
              assert.equal(options.aspectRatio, 1);
              break;

            case 2:
              assert.equal(options.aspectRatio, 2);
              break;
          }

        });
      });

      QUnit.test('options.aspectRatio: undefined', function (assert) {
        var aspectRatio = options.aspectRatio;

        $image.cropper('setAspectRatio', undefined);

        if (isNaN(aspectRatio)) {
          assert.ok(isNaN(options.aspectRatio));
        } else {
          assert.equal(options.aspectRatio, aspectRatio);
        }
      });

    }
  });

});
