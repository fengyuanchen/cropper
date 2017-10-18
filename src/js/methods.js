import $ from 'jquery';
import {
  CLASS_CROP,
  CLASS_DISABLED,
  CLASS_HIDDEN,
  CLASS_MODAL,
  CLASS_MOVE,
  DATA_ACTION,
  DRAG_MODE_CROP,
  DRAG_MODE_MOVE,
  DRAG_MODE_NONE,
  EVENT_LOAD,
  EVENT_ZOOM,
  NAMESPACE,
} from './constants';
import {
  getContainSizes,
  getPointersCenter,
  getSourceCanvas,
  isNumber,
  isUndefined,
  normalizeDecimalNumber,
  objectKeys,
} from './utilities';

export default {
  // Show the crop box manually
  crop() {
    if (!this.ready || this.disabled) {
      return;
    }

    if (!this.cropped) {
      this.cropped = true;
      this.limitCropBox(true, true);

      if (this.options.modal) {
        this.$dragBox.addClass(CLASS_MODAL);
      }

      this.$cropBox.removeClass(CLASS_HIDDEN);
    }

    this.setCropBoxData(this.initialCropBox);
  },

  // Reset the image and crop box to their initial states
  reset() {
    if (!this.ready || this.disabled) {
      return;
    }

    this.image = $.extend({}, this.initialImage);
    this.canvas = $.extend({}, this.initialCanvas);
    this.cropBox = $.extend({}, this.initialCropBox);
    this.renderCanvas();

    if (this.cropped) {
      this.renderCropBox();
    }
  },

  // Clear the crop box
  clear() {
    if (!this.cropped || this.disabled) {
      return;
    }

    $.extend(this.cropBox, {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });

    this.cropped = false;
    this.renderCropBox();
    this.limitCanvas(true, true);

    // Render canvas after crop box rendered
    this.renderCanvas();
    this.$dragBox.removeClass(CLASS_MODAL);
    this.$cropBox.addClass(CLASS_HIDDEN);
  },

  /**
   * Replace the image's src and rebuild the cropper
   * @param {string} url - The new URL.
   * @param {boolean} [onlyColorChanged] - Indicate if the new image only changed color.
   */
  replace(url, onlyColorChanged) {
    if (!this.disabled && url) {
      if (this.isImg) {
        this.$element.attr('src', url);
      }

      if (onlyColorChanged) {
        this.url = url;
        this.$clone.attr('src', url);

        if (this.ready) {
          this.$preview.find('img').add(this.$clone2).attr('src', url);
        }
      } else {
        if (this.isImg) {
          this.replaced = true;
        }

        // Clear previous data
        this.options.data = null;
        this.load(url);
      }
    }
  },

  // Enable (unfreeze) the cropper
  enable() {
    if (this.ready) {
      this.disabled = false;
      this.$cropper.removeClass(CLASS_DISABLED);
    }
  },

  // Disable (freeze) the cropper
  disable() {
    if (this.ready) {
      this.disabled = true;
      this.$cropper.addClass(CLASS_DISABLED);
    }
  },

  // Destroy the cropper and remove the instance from the image
  destroy() {
    const { $element } = this;

    if (this.loaded) {
      if (this.isImg && this.replaced) {
        $element.attr('src', this.originalUrl);
      }

      this.unbuild();
      $element.removeClass(CLASS_HIDDEN);
    } else if (this.isImg) {
      $element.off(EVENT_LOAD, this.start);
    } else if (this.$clone) {
      this.$clone.remove();
    }

    $element.removeData(NAMESPACE);
  },

  /**
   * Move the canvas with relative offsets
   * @param {number} offsetX - The relative offset distance on the x-axis.
   * @param {number} offsetY - The relative offset distance on the y-axis.
   */
  move(offsetX, offsetY) {
    const { left, top } = this.canvas;

    this.moveTo(
      isUndefined(offsetX) ? offsetX : left + Number(offsetX),
      isUndefined(offsetY) ? offsetY : top + Number(offsetY),
    );
  },

  /**
   * Move the canvas to an absolute point
   * @param {number} x - The x-axis coordinate.
   * @param {number} [y=x] - The y-axis coordinate.
   */
  moveTo(x, y) {
    const { canvas } = this;
    let changed = false;

    // If "y" is not present, its default value is "x"
    if (isUndefined(y)) {
      y = x;
    }

    x = Number(x);
    y = Number(y);

    if (this.ready && !this.disabled && this.options.movable) {
      if (isNumber(x)) {
        canvas.left = x;
        changed = true;
      }

      if (isNumber(y)) {
        canvas.top = y;
        changed = true;
      }

      if (changed) {
        this.renderCanvas(true);
      }
    }
  },

  /**
   * Zoom the canvas with a relative ratio
   * @param {Number} ratio - The target ratio.
   * @param {Event} _event - The related event if any.
   */
  zoom(ratio, _event) {
    const { canvas } = this;

    ratio = Number(ratio);

    if (ratio < 0) {
      ratio = 1 / (1 - ratio);
    } else {
      ratio = 1 + ratio;
    }

    this.zoomTo((canvas.width * ratio) / canvas.naturalWidth, _event);
  },

  /**
   * Zoom the canvas to an absolute ratio
   * @param {number} ratio - The target ratio.
   * @param {Event} _event - The related event if any.
   */
  zoomTo(ratio, _event) {
    const { options, pointers, canvas } = this;
    const {
      width,
      height,
      naturalWidth,
      naturalHeight,
    } = canvas;

    ratio = Number(ratio);

    if (ratio >= 0 && this.ready && !this.disabled && options.zoomable) {
      const newWidth = naturalWidth * ratio;
      const newHeight = naturalHeight * ratio;
      let originalEvent;

      if (_event) {
        ({ originalEvent } = _event);
      }

      if (this.trigger(EVENT_ZOOM, {
        originalEvent,
        oldRatio: width / naturalWidth,
        ratio: newWidth / naturalWidth,
      }).isDefaultPrevented()) {
        return;
      }

      if (originalEvent) {
        const offset = this.$cropper.offset();
        const center = pointers && objectKeys(pointers).length ?
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
      this.renderCanvas(true);
    }
  },

  /**
   * Rotate the canvas with a relative degree
   * @param {number} degree - The rotate degree.
   */
  rotate(degree) {
    this.rotateTo((this.image.rotate || 0) + Number(degree));
  },

  /**
   * Rotate the canvas to an absolute degree
   * @param {number} degree - The rotate degree.
   */
  rotateTo(degree) {
    degree = Number(degree);

    if (isNumber(degree) && this.ready && !this.disabled && this.options.rotatable) {
      this.image.rotate = degree % 360;
      this.renderCanvas(true, true);
    }
  },

  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   */
  scaleX(scaleX) {
    const { scaleY } = this.image;

    this.scale(scaleX, isNumber(scaleY) ? scaleY : 1);
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   */
  scaleY(scaleY) {
    const { scaleX } = this.image;

    this.scale(isNumber(scaleX) ? scaleX : 1, scaleY);
  },

  /**
   * Scale the image
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   */
  scale(scaleX, scaleY = scaleX) {
    const { image } = this;
    let transformed = false;

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (this.ready && !this.disabled && this.options.scalable) {
      if (isNumber(scaleX)) {
        image.scaleX = scaleX;
        transformed = true;
      }

      if (isNumber(scaleY)) {
        image.scaleY = scaleY;
        transformed = true;
      }

      if (transformed) {
        this.renderCanvas(true, true);
      }
    }
  },

  /**
   * Get the cropped area position and size data (base on the original image)
   * @param {boolean} [rounded=false] - Indicate if round the data values or not.
   * @returns {Object} The result cropped data.
   */
  getData(rounded = false) {
    const {
      options,
      image,
      canvas,
      cropBox,
    } = this;
    let data;

    if (this.ready && this.cropped) {
      data = {
        x: cropBox.left - canvas.left,
        y: cropBox.top - canvas.top,
        width: cropBox.width,
        height: cropBox.height,
      };

      const ratio = image.width / image.naturalWidth;

      $.each(data, (i, n) => {
        n /= ratio;
        data[i] = rounded ? Math.round(n) : n;
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
   * @param {Object} data - The new data.
   */
  setData(data) {
    const { options, image, canvas } = this;
    const cropBoxData = {};

    if ($.isFunction(data)) {
      data = data.call(this.element);
    }

    if (this.ready && !this.disabled && $.isPlainObject(data)) {
      let transformed = false;

      if (options.rotatable) {
        if (isNumber(data.rotate) && data.rotate !== image.rotate) {
          image.rotate = data.rotate;
          transformed = true;
        }
      }

      if (options.scalable) {
        if (isNumber(data.scaleX) && data.scaleX !== image.scaleX) {
          image.scaleX = data.scaleX;
          transformed = true;
        }

        if (isNumber(data.scaleY) && data.scaleY !== image.scaleY) {
          image.scaleY = data.scaleY;
          transformed = true;
        }
      }

      if (transformed) {
        this.renderCanvas(true, true);
      }

      const ratio = image.width / image.naturalWidth;

      if (isNumber(data.x)) {
        cropBoxData.left = (data.x * ratio) + canvas.left;
      }

      if (isNumber(data.y)) {
        cropBoxData.top = (data.y * ratio) + canvas.top;
      }

      if (isNumber(data.width)) {
        cropBoxData.width = data.width * ratio;
      }

      if (isNumber(data.height)) {
        cropBoxData.height = data.height * ratio;
      }

      this.setCropBoxData(cropBoxData);
    }
  },

  /**
   * Get the container size data.
   * @returns {Object} The result container data.
   */
  getContainerData() {
    return this.ready ? $.extend({}, this.container) : {};
  },

  /**
   * Get the image position and size data.
   * @returns {Object} The result image data.
   */
  getImageData() {
    return this.loaded ? $.extend({}, this.image) : {};
  },

  /**
   * Get the canvas position and size data.
   * @returns {Object} The result canvas data.
   */
  getCanvasData() {
    const { canvas } = this;
    const data = {};

    if (this.ready) {
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
   * Set the canvas position and size with new data.
   * @param {Object} data - The new canvas data.
   */
  setCanvasData(data) {
    const { canvas } = this;
    const { aspectRatio } = canvas;

    if ($.isFunction(data)) {
      data = data.call(this.$element);
    }

    if (this.ready && !this.disabled && $.isPlainObject(data)) {
      if (isNumber(data.left)) {
        canvas.left = data.left;
      }

      if (isNumber(data.top)) {
        canvas.top = data.top;
      }

      if (isNumber(data.width)) {
        canvas.width = data.width;
        canvas.height = data.width / aspectRatio;
      } else if (isNumber(data.height)) {
        canvas.height = data.height;
        canvas.width = data.height * aspectRatio;
      }

      this.renderCanvas(true);
    }
  },

  /**
   * Get the crop box position and size data.
   * @returns {Object} The result crop box data.
   */
  getCropBoxData() {
    const { cropBox } = this;

    return this.ready && this.cropped ? {
      left: cropBox.left,
      top: cropBox.top,
      width: cropBox.width,
      height: cropBox.height,
    } : {};
  },

  /**
   * Set the crop box position and size with new data.
   * @param {Object} data - The new crop box data.
   */
  setCropBoxData(data) {
    const { cropBox } = this;
    const { aspectRatio } = this.options;
    let widthChanged;
    let heightChanged;

    if ($.isFunction(data)) {
      data = data.call(this.$element);
    }

    if (this.ready && this.cropped && !this.disabled && $.isPlainObject(data)) {
      if (isNumber(data.left)) {
        cropBox.left = data.left;
      }

      if (isNumber(data.top)) {
        cropBox.top = data.top;
      }

      if (isNumber(data.width) && data.width !== cropBox.width) {
        widthChanged = true;
        cropBox.width = data.width;
      }

      if (isNumber(data.height) && data.height !== cropBox.height) {
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

      this.renderCropBox();
    }
  },

  /**
   * Get a canvas drawn the cropped image.
   * @param {Object} [options={}] - The config options.
   * @returns {HTMLCanvasElement} - The result canvas.
   */
  getCroppedCanvas(options = {}) {
    if (!this.ready || !window.HTMLCanvasElement) {
      return null;
    }

    const { canvas: canvasData } = this;
    const source = getSourceCanvas(this.$clone[0], this.image, canvasData, options);

    // Returns the source canvas if it is not cropped.
    if (!this.cropped) {
      return source;
    }

    const {
      x,
      y,
      width: initialWidth,
      height: initialHeight,
    } = this.getData();
    const aspectRatio = initialWidth / initialHeight;
    const maxSizes = getContainSizes({
      aspectRatio,
      width: options.maxWidth || Infinity,
      height: options.maxHeight || Infinity,
    });
    const minSizes = getContainSizes({
      aspectRatio,
      width: options.minWidth || 0,
      height: options.minHeight || 0,
    });
    let {
      width,
      height,
    } = getContainSizes({
      aspectRatio,
      width: options.width || initialWidth,
      height: options.height || initialHeight,
    });

    width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
    height = Math.min(maxSizes.height, Math.max(minSizes.height, height));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);
    context.fillStyle = options.fillColor || 'transparent';
    context.fillRect(0, 0, width, height);

    const { imageSmoothingEnabled = true, imageSmoothingQuality } = options;

    context.imageSmoothingEnabled = imageSmoothingEnabled;

    if (imageSmoothingQuality) {
      context.imageSmoothingQuality = imageSmoothingQuality;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
    const sourceWidth = source.width;
    const sourceHeight = source.height;

    // Source canvas parameters
    let srcX = x;
    let srcY = y;
    let srcWidth;
    let srcHeight;

    // Destination canvas parameters
    let dstX;
    let dstY;
    let dstWidth;
    let dstHeight;

    if (srcX <= -initialWidth || srcX > sourceWidth) {
      srcX = 0;
      srcWidth = 0;
      dstX = 0;
      dstWidth = 0;
    } else if (srcX <= 0) {
      dstX = -srcX;
      srcX = 0;
      srcWidth = Math.min(sourceWidth, initialWidth + srcX);
      dstWidth = srcWidth;
    } else if (srcX <= sourceWidth) {
      dstX = 0;
      srcWidth = Math.min(initialWidth, sourceWidth - srcX);
      dstWidth = srcWidth;
    }

    if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
      srcY = 0;
      srcHeight = 0;
      dstY = 0;
      dstHeight = 0;
    } else if (srcY <= 0) {
      dstY = -srcY;
      srcY = 0;
      srcHeight = Math.min(sourceHeight, initialHeight + srcY);
      dstHeight = srcHeight;
    } else if (srcY <= sourceHeight) {
      dstY = 0;
      srcHeight = Math.min(initialHeight, sourceHeight - srcY);
      dstHeight = srcHeight;
    }

    // All the numerical parameters should be integer for `drawImage`
    // https://github.com/fengyuanchen/cropper/issues/476
    const params = [
      srcX,
      srcY,
      srcWidth,
      srcHeight,
    ];

    // Avoid "IndexSizeError"
    if (dstWidth > 0 && dstHeight > 0) {
      const scale = width / initialWidth;

      params.push(
        dstX * scale,
        dstY * scale,
        dstWidth * scale,
        dstHeight * scale,
      );
    }

    context.drawImage(source, ...$.map(params, param => Math.floor(normalizeDecimalNumber(param))));
    return canvas;
  },

  /**
   * Change the aspect ratio of the crop box.
   * @param {number} aspectRatio - The new aspect ratio.
   */
  setAspectRatio(aspectRatio) {
    const { options } = this;

    if (!this.disabled && !isUndefined(aspectRatio)) {
      // 0 -> NaN
      options.aspectRatio = Math.max(0, aspectRatio) || NaN;

      if (this.ready) {
        this.initCropBox();

        if (this.cropped) {
          this.renderCropBox();
        }
      }
    }
  },

  /**
   * Change the drag mode.
   * @param {string} mode - The new drag mode.
   */
  setDragMode(mode) {
    const { options } = this;
    let croppable;
    let movable;

    if (this.loaded && !this.disabled) {
      croppable = mode === DRAG_MODE_CROP;
      movable = options.movable && mode === DRAG_MODE_MOVE;
      mode = (croppable || movable) ? mode : DRAG_MODE_NONE;

      this.$dragBox
        .data(DATA_ACTION, mode)
        .toggleClass(CLASS_CROP, croppable)
        .toggleClass(CLASS_MOVE, movable);

      if (!options.cropBoxMovable) {
        // Sync drag mode to crop box when it is not movable(#300)
        this.$face
          .data(DATA_ACTION, mode)
          .toggleClass(CLASS_CROP, croppable)
          .toggleClass(CLASS_MOVE, movable);
      }
    }
  },
};
