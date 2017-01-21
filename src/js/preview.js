import $ from 'jquery';
import * as utils from './utilities';

const DATA_PREVIEW = 'preview';

export default {
  initPreview() {
    const self = this;
    const crossOrigin = utils.getCrossOrigin(self.crossOrigin);
    const url = crossOrigin ? self.crossOriginUrl : self.url;
    let $clone2;

    self.$preview = $(self.options.preview);
    self.$clone2 = $clone2 = $(`<img ${crossOrigin} src="${url}">`);
    self.$viewBox.html($clone2);
    self.$preview.each((i, element) => {
      const $this = $(element);

      // Save the original size for recover
      $this.data(DATA_PREVIEW, {
        width: $this.width(),
        height: $this.height(),
        html: $this.html()
      });

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * (Occur only when margin-top <= -height)
       */
      $this.html(
        `<img ${crossOrigin} src="${url}" style="` +
        'display:block;width:100%;height:auto;' +
        'min-width:0!important;min-height:0!important;' +
        'max-width:none!important;max-height:none!important;' +
        'image-orientation:0deg!important;">'
      );
    });
  },

  resetPreview() {
    this.$preview.each((i, element) => {
      const $this = $(element);
      const data = $this.data(DATA_PREVIEW);

      $this.css({
        width: data.width,
        height: data.height
      }).html(data.html).removeData(DATA_PREVIEW);
    });
  },

  preview() {
    const self = this;
    const image = self.image;
    const canvas = self.canvas;
    const cropBox = self.cropBox;
    const cropBoxWidth = cropBox.width;
    const cropBoxHeight = cropBox.height;
    const width = image.width;
    const height = image.height;
    const left = cropBox.left - canvas.left - image.left;
    const top = cropBox.top - canvas.top - image.top;

    if (!self.cropped || self.disabled) {
      return;
    }

    self.$clone2.css({
      width,
      height,
      transform: utils.getTransform($.extend({
        translateX: -left,
        translateY: -top,
      }, image)),
    });

    self.$preview.each((i, element) => {
      const $this = $(element);
      const data = $this.data(DATA_PREVIEW);
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

      $this.css({
        width: newWidth,
        height: newHeight
      }).find('img').css({
        width: width * ratio,
        height: height * ratio,
        transform: utils.getTransform($.extend({
          translateX: -left * ratio,
          translateY: -top * ratio,
        }, image)),
      });
    });
  },
};
