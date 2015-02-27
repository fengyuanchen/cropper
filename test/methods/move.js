$(function () {

  'use strict';

  var $image = $(window.createCropperImage()),
      random = function (offset) {
        var n = Math.random() * offset;

        return parseInt(n, 10) % 2 === 0 ? -n : n;
      };

  $image.cropper({
    built: function () {
      var cropper = $(this).data('cropper'),
          image = cropper.image,
          offsets = (function () {
            var data = [],
                max = 100,
                i = 10;

            while (i--) {
              data.push({
                x: random(max),
                y: random(max)
              });
            }

            return data;
          })();

      QUnit.test('methods.move', function (assert) {
        $.each(offsets, function (i, offset) {
          var left = image.left + offset.x,
              top = image.top + offset.y;

          $image.cropper('move', offset.x, offset.y);

          assert.ok(image.left === left);
          assert.ok(image.top === top);
        });
      });

    }
  });

});
