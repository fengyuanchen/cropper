import $ from 'jquery';
import Cropper from 'cropperjs/src';

if ($.fn) {
  const AnotherCropper = $.fn.cropper;
  const NAMESPACE = 'cropper';

  $.fn.cropper = function jQueryCropper(option, ...args) {
    let result;

    this.each((i, element) => {
      const $element = $(element);
      const isDestroy = option === 'destroy';
      let cropper = $element.data(NAMESPACE);

      if (!cropper) {
        if (isDestroy) {
          return;
        }

        const options = $.extend({}, $element.data(), $.isPlainObject(option) && option);

        cropper = new Cropper(element, options);
        $element.data(NAMESPACE, cropper);
      }

      if (typeof option === 'string') {
        const fn = cropper[option];

        if ($.isFunction(fn)) {
          result = fn.apply(cropper, args);

          if (result === cropper) {
            result = undefined;
          }

          if (isDestroy) {
            $element.removeData(NAMESPACE);
          }
        }
      }
    });

    return typeof result === 'undefined' ? this : result;
  };

  $.fn.cropper.Constructor = Cropper;
  $.fn.cropper.setDefaults = Cropper.setDefaults;
  $.fn.cropper.noConflict = function noConflict() {
    $.fn.cropper = AnotherCropper;
    return this;
  };
}
