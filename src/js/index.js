import $ from 'jquery';
import Cropper from './cropper';
import {
  NAMESPACE,
} from './constants';
import {
  isString,
  isUndefined,
} from './utilities';

if ($.fn) {
  const AnotherCropper = $.fn.cropper;

  $.fn.cropper = function jQueryCropper(option, ...args) {
    let result;

    this.each((i, element) => {
      const $element = $(element);
      let data = $element.data(NAMESPACE);

      if (!data) {
        if (/destroy/.test(option)) {
          return;
        }

        const options = $.extend({}, $element.data(), $.isPlainObject(option) && option);

        data = new Cropper(element, options);
        $element.data(NAMESPACE, data);
      }

      if (isString(option)) {
        const fn = data[option];

        if ($.isFunction(fn)) {
          result = fn.apply(data, args);
        }
      }
    });

    return isUndefined(result) ? this : result;
  };

  $.fn.cropper.Constructor = Cropper;
  $.fn.cropper.setDefaults = Cropper.setDefaults;
  $.fn.cropper.noConflict = function noConflict() {
    $.fn.cropper = AnotherCropper;
    return this;
  };
}
