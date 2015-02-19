$(function () {

  'use strict';

  var $image = $(window.createCropperImage());

  $image.cropper({
    crop: function (data) {

      QUnit.test('options.crop', function (assert) {
        assert.ok($.isPlainObject(data));
        assert.ok(typeof data.x === 'number');
        assert.ok(typeof data.y === 'number');
        assert.ok(typeof data.width === 'number');
        assert.ok(typeof data.height === 'number');
      });

    }
  });

});
