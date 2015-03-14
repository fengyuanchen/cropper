$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    built: function () {
      var image = $image.data('cropper').image;

      QUnit.test('methods.flip', function (assert) {
        assert.ok(image.flip.horizontal === false);
        assert.ok(image.flip.vertical === false);
        $image.cropper('flip', 'horizontal');
        assert.ok(image.flip.horizontal === true);
        assert.ok(image.flip.vertical === false);
        $image.cropper('flip', 'vertical');
        assert.ok(image.flip.horizontal === true);
        assert.ok(image.flip.vertical === true);
        $image.cropper('flip', 'horizontal');
        assert.ok(image.flip.horizontal === false);
        assert.ok(image.flip.vertical === true);
        $image.cropper('flip', 'vertical');
        assert.ok(image.flip.horizontal === false);
        assert.ok(image.flip.vertical === false);
      });

    }
  });

});
