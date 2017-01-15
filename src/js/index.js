import $ from 'jquery';
import Cropper from './cropper';

const NAMESPACE = 'cropper';
const OtherCropper = $.fn.cropper;

$.fn.cropper = function jQueryCropper(option, ...args) {
  let result;

  this.each((i, element) => {
    const $this = $(element);
    let data = $this.data(NAMESPACE);

    if (!data) {
      if (/destroy/.test(option)) {
        return;
      }

      const options = $.extend({}, $this.data(), $.isPlainObject(option) && option);
      $this.data(NAMESPACE, (data = new Cropper(element, options)));
    }

    if (typeof option === 'string') {
      const fn = data[option];

      if ($.isFunction(fn)) {
        result = fn.apply(data, args);
      }
    }
  });

  return typeof result !== 'undefined' ? result : this;
};

$.fn.cropper.Constructor = Cropper;
$.fn.cropper.setDefaults = Cropper.setDefaults;

// No conflict
$.fn.cropper.noConflict = function noConflict() {
  $.fn.cropper = OtherCropper;
  return this;
};
