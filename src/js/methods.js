import $ from 'jquery';
import * as utils from './utilities';

function getPointersCenter(pointers) {
  let pageX = 0;
  let pageY = 0;
  let count = 0;

  $.each(pointers, (i, { startX, startY }) => {
    pageX += startX;
    pageY += startY;
    count += 1;
  });

  pageX /= count;
  pageY /= count;

  return {
    pageX,
    pageY,
  };
}

export default {
  // Show the crop box manually
  crop() {
    const self = this;

    if (!self.ready || self.disabled) {
      return;
    }

    if (!self.cropped) {
      self.cropped = true;
      self.limitCropBox(true, true);

      if (self.options.modal) {
        self.$dragBox.addClass('cropper-modal');
      }

      self.$cropBox.removeClass('cropper-hidden');
    }

    self.setCropBoxData(self.initialCropBox);
  },

  // Reset the image and crop box to their initial states
  reset() {
    const self = this;

    if (!self.ready || self.disabled) {
      return;
    }

    self.image = $.extend({}, self.initialImage);
    self.canvas = $.extend({}, self.initialCanvas);
    self.cropBox = $.extend({}, self.initialCropBox);

    self.renderCanvas();

    if (self.cropped) {
      self.renderCropBox();
    }
  },

  // Clear the crop box
  clear() {
    const self = this;

    if (!self.cropped || self.disabled) {
      return;
    }

    $.extend(self.cropBox, {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });

    self.cropped = false;
    self.renderCropBox();

    self.limitCanvas(true, true);

    // Render canvas after crop box rendered
    self.renderCanvas();

    self.$dragBox.removeClass('cropper-modal');
    self.$cropBox.addClass('cropper-hidden');
  },

  /**
   * Replace the image's src and rebuild the cropper
   *
   * @param {String} url
   * @param {Boolean} onlyColorChanged (optional)
   */
  replace(url, onlyColorChanged) {
    const self = this;

    if (!self.disabled && url) {
      if (self.isImg) {
        self.$element.attr('src', url);
      }

      if (onlyColorChanged) {
        self.url = url;
        self.$clone.attr('src', url);

        if (self.ready) {
          self.$preview.find('img').add(self.$clone2).attr('src', url);
        }
      } else {
        if (self.isImg) {
          self.replaced = true;
        }

        // Clear previous data
        self.options.data = null;
        self.load(url);
      }
    }
  },

  // Enable (unfreeze) the cropper
  enable() {
    const self = this;

    if (self.ready) {
      self.disabled = false;
      self.$cropper.removeClass('cropper-disabled');
    }
  },

  // Disable (freeze) the cropper
  disable() {
    const self = this;

    if (self.ready) {
      self.disabled = true;
      self.$cropper.addClass('cropper-disabled');
    }
  },

  // Destroy the cropper and remove the instance from the image
  destroy() {
    const self = this;
    const $this = self.$element;

    if (self.loaded) {
      if (self.isImg && self.replaced) {
        $this.attr('src', self.originalUrl);
      }

      self.unbuild();
      $this.removeClass('cropper-hidden');
    } else if (self.isImg) {
      $this.off('load', self.start);
    } else if (self.$clone) {
      self.$clone.remove();
    }

    $this.removeData('cropper');
  },

  /**
   * Move the canvas with relative offsets
   *
   * @param {Number} offsetX
   * @param {Number} offsetY (optional)
   */
  move(offsetX, offsetY) {
    const self = this;
    const canvas = self.canvas;

    self.moveTo(
      utils.isUndefined(offsetX) ? offsetX : canvas.left + Number(offsetX),
      utils.isUndefined(offsetY) ? offsetY : canvas.top + Number(offsetY),
    );
  },

  /**
   * Move the canvas to an absolute point
   *
   * @param {Number} x
   * @param {Number} y (optional)
   */
  moveTo(x, y) {
    const self = this;
    const canvas = self.canvas;
    let changed = false;

    // If "y" is not present, its default value is "x"
    if (utils.isUndefined(y)) {
      y = x;
    }

    x = Number(x);
    y = Number(y);

    if (self.ready && !self.disabled && self.options.movable) {
      if (utils.isNumber(x)) {
        canvas.left = x;
        changed = true;
      }

      if (utils.isNumber(y)) {
        canvas.top = y;
        changed = true;
      }

      if (changed) {
        self.renderCanvas(true);
      }
    }
  },

  /**
   * Zoom the canvas with a relative ratio
   *
   * @param {Number} ratio
   * @param {jQuery Event} _event (private)
   */
  zoom(ratio, _event) {
    const self = this;
    const canvas = self.canvas;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    self.zoomTo((canvas.width * ratio) / canvas.naturalWidth, _event);
  },

  /**
   * Zoom the canvas to an absolute ratio
   *
   * @param {Number} ratio
   * @param {jQuery Event} _event (private)
   */
  zoomTo(ratio, _event) {
    const self = this;
    const options = self.options;
    const pointers = self.pointers;
    const canvas = self.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const naturalWidth = canvas.naturalWidth;
    const naturalHeight = canvas.naturalHeight;

    ratio = Number(ratio);

    if (ratio >= 0 && self.ready && !self.disabled && options.zoomable) {
      const newWidth = naturalWidth * ratio;
      const newHeight = naturalHeight * ratio;
      let originalEvent;

      if (_event) {
        originalEvent = _event.originalEvent;
      }

      if (self.trigger('zoom', {
        originalEvent,
        oldRatio: width / naturalWidth,
        ratio: newWidth / naturalWidth,
      }).isDefaultPrevented()) {
        return;
      }

      if (originalEvent) {
        const offset = self.$cropper.offset();
        const center = pointers && utils.objectKeys(pointers).length ?
          getPointersCenter(pointers) : {
            pageX: _event.pageX || originalEvent.pageX || 0,
            pageY: _event.pageY || originalEvent.pageY || 0,
          };

        // Zoom from the triggering point of the event
        canvas.left -= (newWidth - width) * (
          ((center.pageX - offset.left) - canvas.left) / width
        );
        canvas.top -= (newHeight - height) * (
          ((center.pageY - offset.top) - canvas.top) / height
        );
      } else {
        // Zoom from the center of the canvas
        canvas.left -= (newWidth - width) / 2;
        canvas.top -= (newHeight - height) / 2;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      self.renderCanvas(true);
    }
  },

  /**
   * Rotate the canvas with a relative degree
   *
   * @param {Number} degree
   */
  rotate(degree) {
    const self = this;

    self.rotateTo((self.image.rotate || 0) + Number(degree));
  },

  /**
   * Rotate the canvas to an absolute degree
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#rotate()
   *
   * @param {Number} degree
   */
  rotateTo(degree) {
    const self = this;

    degree = Number(degree);

    if (utils.isNumber(degree) && self.ready && !self.disabled && self.options.rotatable) {
      self.image.rotate = degree % 360;
      self.rotated = true;
      self.renderCanvas(true);
    }
  },

  /**
   * Scale the image
   * https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function#scale()
   *
   * @param {Number} scaleX
   * @param {Number} scaleY (optional)
   */
  scale(scaleX, scaleY) {
    const self = this;
    const image = self.image;
    let changed = false;

    // If "scaleY" is not present, its default value is "scaleX"
    if (utils.isUndefined(scaleY)) {
      scaleY = scaleX;
    }

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (self.ready && !self.disabled && self.options.scalable) {
      if (utils.isNumber(scaleX)) {
        image.scaleX = scaleX;
        changed = true;
      }

      if (utils.isNumber(scaleY)) {
        image.scaleY = scaleY;
        changed = true;
      }

      if (changed) {
        self.renderImage(true);
      }
    }
  },

  /**
   * Scale the abscissa of the image
   *
   * @param {Number} scaleX
   */
  scaleX(scaleX) {
    const self = this;
    const scaleY = self.image.scaleY;

    self.scale(scaleX, utils.isNumber(scaleY) ? scaleY : 1);
  },

  /**
   * Scale the ordinate of the image
   *
   * @param {Number} scaleY
   */
  scaleY(scaleY) {
    const self = this;
    const scaleX = self.image.scaleX;

    self.scale(utils.isNumber(scaleX) ? scaleX : 1, scaleY);
  },

  /**
   * Get the cropped area position and size data (base on the original image)
   *
   * @param {Boolean} isRounded (optional)
   * @return {Object} data
   */
  getData(isRounded) {
    const self = this;
    const options = self.options;
    const image = self.image;
    const canvas = self.canvas;
    const cropBox = self.cropBox;
    let ratio;
    let data;

    if (self.ready && self.cropped) {
      data = {
        x: cropBox.left - canvas.left,
        y: cropBox.top - canvas.top,
        width: cropBox.width,
        height: cropBox.height,
      };

      ratio = image.width / image.naturalWidth;

      $.each(data, (i, n) => {
        n /= ratio;
        data[i] = isRounded ? Math.round(n) : n;
      });
    } else {
      data = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    }

    if (options.rotatable) {
      data.rotate = image.rotate || 0;
    }

    if (options.scalable) {
      data.scaleX = image.scaleX || 1;
      data.scaleY = image.scaleY || 1;
    }

    return data;
  },

  /**
   * Set the cropped area position and size with new data
   *
   * @param {Object} data
   */
  setData(data) {
    const self = this;
    const options = self.options;
    const image = self.image;
    const canvas = self.canvas;
    const cropBoxData = {};
    let rotated;
    let isScaled;
    let ratio;

    if ($.isFunction(data)) {
      data = data.call(self.element);
    }

    if (self.ready && !self.disabled && $.isPlainObject(data)) {
      if (options.rotatable) {
        if (utils.isNumber(data.rotate) && data.rotate !== image.rotate) {
          image.rotate = data.rotate;
          rotated = true;
          self.rotated = rotated;
        }
      }

      if (options.scalable) {
        if (utils.isNumber(data.scaleX) && data.scaleX !== image.scaleX) {
          image.scaleX = data.scaleX;
          isScaled = true;
        }

        if (utils.isNumber(data.scaleY) && data.scaleY !== image.scaleY) {
          image.scaleY = data.scaleY;
          isScaled = true;
        }
      }

      if (rotated) {
        self.renderCanvas();
      } else if (isScaled) {
        self.renderImage();
      }

      ratio = image.width / image.naturalWidth;

      if (utils.isNumber(data.x)) {
        cropBoxData.left = (data.x * ratio) + canvas.left;
      }

      if (utils.isNumber(data.y)) {
        cropBoxData.top = (data.y * ratio) + canvas.top;
      }

      if (utils.isNumber(data.width)) {
        cropBoxData.width = data.width * ratio;
      }

      if (utils.isNumber(data.height)) {
        cropBoxData.height = data.height * ratio;
      }

      self.setCropBoxData(cropBoxData);
    }
  },

  /**
   * Get the container size data
   *
   * @return {Object} data
   */
  getContainerData() {
    return this.ready ? this.container : {};
  },

  /**
   * Get the image position and size data
   *
   * @return {Object} data
   */
  getImageData() {
    return this.loaded ? this.image : {};
  },

  /**
   * Get the canvas position and size data
   *
   * @return {Object} data
   */
  getCanvasData() {
    const self = this;
    const canvas = self.canvas;
    const data = {};

    if (self.ready) {
      $.each([
        'left',
        'top',
        'width',
        'height',
        'naturalWidth',
        'naturalHeight',
      ], (i, n) => {
        data[n] = canvas[n];
      });
    }

    return data;
  },

  /**
   * Set the canvas position and size with new data
   *
   * @param {Object} data
   */
  setCanvasData(data) {
    const self = this;
    const canvas = self.canvas;
    const aspectRatio = canvas.aspectRatio;

    if ($.isFunction(data)) {
      data = data.call(self.$element);
    }

    if (self.ready && !self.disabled && $.isPlainObject(data)) {
      if (utils.isNumber(data.left)) {
        canvas.left = data.left;
      }

      if (utils.isNumber(data.top)) {
        canvas.top = data.top;
      }

      if (utils.isNumber(data.width)) {
        canvas.width = data.width;
        canvas.height = data.width / aspectRatio;
      } else if (utils.isNumber(data.height)) {
        canvas.height = data.height;
        canvas.width = data.height * aspectRatio;
      }

      self.renderCanvas(true);
    }
  },

  /**
   * Get the crop box position and size data
   *
   * @return {Object} data
   */
  getCropBoxData() {
    const self = this;
    const cropBox = self.cropBox;

    return self.ready && self.cropped ? {
      left: cropBox.left,
      top: cropBox.top,
      width: cropBox.width,
      height: cropBox.height,
    } : {};
  },

  /**
   * Set the crop box position and size with new data
   *
   * @param {Object} data
   */
  setCropBoxData(data) {
    const self = this;
    const cropBox = self.cropBox;
    const aspectRatio = self.options.aspectRatio;
    let widthChanged;
    let heightChanged;

    if ($.isFunction(data)) {
      data = data.call(self.$element);
    }

    if (self.ready && self.cropped && !self.disabled && $.isPlainObject(data)) {
      if (utils.isNumber(data.left)) {
        cropBox.left = data.left;
      }

      if (utils.isNumber(data.top)) {
        cropBox.top = data.top;
      }

      if (utils.isNumber(data.width) && data.width !== cropBox.width) {
        widthChanged = true;
        cropBox.width = data.width;
      }

      if (utils.isNumber(data.height) && data.height !== cropBox.height) {
        heightChanged = true;
        cropBox.height = data.height;
      }

      if (aspectRatio) {
        if (widthChanged) {
          cropBox.height = cropBox.width / aspectRatio;
        } else if (heightChanged) {
          cropBox.width = cropBox.height * aspectRatio;
        }
      }

      self.renderCropBox();
    }
  },

  /**
   * Get a canvas drawn the cropped image
   *
   * @param {Object} options (optional)
   * @return {HTMLCanvasElement} canvas
   */
  getCroppedCanvas(options) {
    const self = this;

    if (!self.ready || !window.HTMLCanvasElement) {
      return null;
    }

    if (!$.isPlainObject(options)) {
      options = {};
    }

    if (!self.cropped) {
      return utils.getSourceCanvas(self.$clone[0], self.image, options);
    }

    const data = self.getData();
    const originalWidth = data.width;
    const originalHeight = data.height;
    const aspectRatio = originalWidth / originalHeight;
    let scaledWidth;
    let scaledHeight;
    let scaledRatio;

    if ($.isPlainObject(options)) {
      scaledWidth = options.width;
      scaledHeight = options.height;

      if (scaledWidth) {
        scaledHeight = scaledWidth / aspectRatio;
        scaledRatio = scaledWidth / originalWidth;
      } else if (scaledHeight) {
        scaledWidth = scaledHeight * aspectRatio;
        scaledRatio = scaledHeight / originalHeight;
      }
    }

    // The canvas element will use `Math.Math.floor` on a float number, so Math.floor first
    const canvasWidth = Math.floor(scaledWidth || originalWidth);
    const canvasHeight = Math.floor(scaledHeight || originalHeight);

    const canvas = $('<canvas>')[0];
    const context = canvas.getContext('2d');

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (options.fillColor) {
      context.fillStyle = options.fillColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
    const parameters = (() => {
      const source = utils.getSourceCanvas(self.$clone[0], self.image, options);
      const sourceWidth = source.width;
      const sourceHeight = source.height;
      const canvasData = self.canvas;
      const params = [source];

      // Source canvas
      let srcX = data.x + ((canvasData.naturalWidth * (Math.abs(data.scaleX || 1) - 1)) / 2);
      let srcY = data.y + ((canvasData.naturalHeight * (Math.abs(data.scaleY || 1) - 1)) / 2);
      let srcWidth;
      let srcHeight;

      // Destination canvas
      let dstX;
      let dstY;
      let dstWidth;
      let dstHeight;

      if (srcX <= -originalWidth || srcX > sourceWidth) {
        srcX = 0;
        srcWidth = 0;
        dstX = 0;
        dstWidth = 0;
      } else if (srcX <= 0) {
        dstX = -srcX;
        srcX = 0;
        dstWidth = Math.min(sourceWidth, originalWidth + srcX);
        srcWidth = dstWidth;
      } else if (srcX <= sourceWidth) {
        dstX = 0;
        dstWidth = Math.min(originalWidth, sourceWidth - srcX);
        srcWidth = dstWidth;
      }

      if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
        srcY = 0;
        srcHeight = 0;
        dstY = 0;
        dstHeight = 0;
      } else if (srcY <= 0) {
        dstY = -srcY;
        srcY = 0;
        dstHeight = Math.min(sourceHeight, originalHeight + srcY);
        srcHeight = dstHeight;
      } else if (srcY <= sourceHeight) {
        dstY = 0;
        dstHeight = Math.min(originalHeight, sourceHeight - srcY);
        srcHeight = dstHeight;
      }

      // All the numerical parameters should be integer for `drawImage` (#476)
      params.push(Math.floor(srcX), Math.floor(srcY), Math.floor(srcWidth), Math.floor(srcHeight));

      // Scale destination sizes
      if (scaledRatio) {
        dstX *= scaledRatio;
        dstY *= scaledRatio;
        dstWidth *= scaledRatio;
        dstHeight *= scaledRatio;
      }

      // Avoid "IndexSizeError" in IE and Firefox
      if (dstWidth > 0 && dstHeight > 0) {
        params.push(
          Math.floor(dstX),
          Math.floor(dstY),
          Math.floor(dstWidth),
          Math.floor(dstHeight),
        );
      }

      return params;
    })();

    context.imageSmoothingEnabled = !!options.imageSmoothingEnabled;

    if (options.imageSmoothingQuality) {
      context.imageSmoothingQuality = options.imageSmoothingQuality;
    }

    context.drawImage(...parameters);

    return canvas;
  },

  /**
   * Change the aspect ratio of the crop box
   *
   * @param {Number} aspectRatio
   */
  setAspectRatio(aspectRatio) {
    const self = this;
    const options = self.options;

    if (!self.disabled && !utils.isUndefined(aspectRatio)) {
      // 0 -> NaN
      options.aspectRatio = Math.max(0, aspectRatio) || NaN;

      if (self.ready) {
        self.initCropBox();

        if (self.cropped) {
          self.renderCropBox();
        }
      }
    }
  },

  /**
   * Change the drag mode
   *
   * @param {String} mode (optional)
   */
  setDragMode(mode) {
    const self = this;
    const options = self.options;
    let croppable;
    let movable;

    if (self.loaded && !self.disabled) {
      croppable = mode === 'crop';
      movable = options.movable && mode === 'move';
      mode = (croppable || movable) ? mode : 'none';

      self.$dragBox
        .data('action', mode)
        .toggleClass('cropper-crop', croppable)
        .toggleClass('cropper-move', movable);

      if (!options.cropBoxMovable) {
        // Sync drag mode to crop box when it is not movable(#300)
        self.$face
          .data('action', mode)
          .toggleClass('cropper-crop', croppable)
          .toggleClass('cropper-move', movable);
      }
    }
  },
};
