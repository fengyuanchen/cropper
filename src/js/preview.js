import $ from 'jquery';
import {
  DATA_PREVIEW,
} from './constants';
import {
  getTransformValues,
} from './utilities';

export default {
  initPreview() {
    const { crossOrigin } = this;
    const url = crossOrigin ? this.crossOriginUrl : this.url;
    const image = document.createElement('img');

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = url;

    const $clone2 = $(image);

    this.$preview = $(this.options.preview);
    this.$clone2 = $clone2;
    this.$viewBox.html($clone2);
    this.$preview.each((i, element) => {
      const $element = $(element);
      const img = document.createElement('img');

      // Save the original size for recover
      $element.data(DATA_PREVIEW, {
        width: $element.width(),
        height: $element.height(),
        html: $element.html(),
      });

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.src = url;

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * Add `height:auto` to override `height` attribute on IE8
       * (Occur only when margin-top <= -height)
       */
      img.style.cssText = (
        'display:block;' +
        'width:100%;' +
        'height:auto;' +
        'min-width:0!important;' +
        'min-height:0!important;' +
        'max-width:none!important;' +
        'max-height:none!important;' +
        'image-orientation:0deg!important;"'
      );

      $element.html(img);
    });
  },

  resetPreview() {
    this.$preview.each((i, element) => {
      const $element = $(element);
      const data = $element.data(DATA_PREVIEW);

      $element.css({
        width: data.width,
        height: data.height,
      }).html(data.html).removeData(DATA_PREVIEW);
    });
  },

  preview() {
    const { image, canvas, cropBox } = this;
    const { width: cropBoxWidth, height: cropBoxHeight } = cropBox;
    const { width, height } = image;
    const left = cropBox.left - canvas.left - image.left;
    const top = cropBox.top - canvas.top - image.top;

    if (!this.cropped || this.disabled) {
      return;
    }

    this.$clone2.css({
      width,
      height,
      transform: getTransformValues($.extend({
        translateX: -left,
        translateY: -top,
      }, image)),
    });

    this.$preview.each((i, element) => {
      const $element = $(element);
      const data = $element.data(DATA_PREVIEW);
      const originalWidth = data.width;
      const originalHeight = data.height;
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      let ratio = 1;

      if (cropBoxWidth) {
        ratio = originalWidth / cropBoxWidth;
        newHeight = cropBoxHeight * ratio;
      }

      if (cropBoxHeight && newHeight > originalHeight) {
        ratio = originalHeight / cropBoxHeight;
        newWidth = cropBoxWidth * ratio;
        newHeight = originalHeight;
      }

      $element.css({
        width: newWidth,
        height: newHeight,
      }).find('img').css({
        width: width * ratio,
        height: height * ratio,
        transform: getTransformValues($.extend({
          translateX: -left * ratio,
          translateY: -top * ratio,
        }, image)),
      });
    });
  },
};
