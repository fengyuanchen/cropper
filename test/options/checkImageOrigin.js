$(function () {

  'use strict';

  var $image = $(window.createCropperImage('https://avatars1.githubusercontent.com/u/3456749?v=3&s=460'));

  $image.cropper({
    checkImageOrigin: false,

    built: function () {
      var cropper = $image.data('cropper');

      QUnit.test('options.checkImageOrigin', function (assert) {
        assert.ok(typeof cropper.$clone.attr('crossOrigin') === 'undefined');
      });

    }
  });

});
