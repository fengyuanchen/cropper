$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var image = $image.data('cropper').image;

      QUnit.test('methods.flip', function (assert) {
        assert.ok(image.flip.horizontally === false);
        assert.ok(image.flip.vertically === false);
        $image.cropper('flip', 'horizontally');
        assert.ok(image.flip.horizontally === true);
        assert.ok(image.flip.vertically === false);
        $image.cropper('flip', 'vertically');
        assert.ok(image.flip.horizontally === true);
        assert.ok(image.flip.vertically === true);
        $image.cropper('flip', 'horizontally');
        assert.ok(image.flip.horizontally === false);
        assert.ok(image.flip.vertically === true);
        $image.cropper('flip', 'vertically');
        assert.ok(image.flip.horizontally === false);
        assert.ok(image.flip.vertically === false);
      });

    }
  });

});
