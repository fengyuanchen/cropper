$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {

      QUnit.test('methods.getDataURL', function (assert) {
        var dataURL = $image.cropper('getDataURL');

        assert.ok(/^data\:image\/png/.test(dataURL));
      });

      QUnit.test('methods.getDataURL: jpg', function (assert) {
        var dataURL = $image.cropper('getDataURL', 'image/jpeg');

        assert.ok(/^data\:image\/jpeg/.test(dataURL));
      });

      QUnit.test('methods.getDataURL: resize', function (assert) {
        var dataURL = $image.cropper('getDataURL', {
              width: 160,
              height: 90
            }),
            done = assert.async();

        $('<img src="' + dataURL + '">').one('load', function () {
          assert.equal(this.width, 160);
          assert.equal(this.height, 90);
          done();
        });
      });

    }
  });

});
