import $ from 'jquery';
import * as utils from './utilities';

export default {
  render() {
    const self = this;

    self.initContainer();
    self.initCanvas();
    self.initCropBox();

    self.renderCanvas();

    if (self.cropped) {
      self.renderCropBox();
    }
  },

  initContainer() {
    const self = this;
    const options = self.options;
    const $this = self.$element;
    const $container = self.$container;
    const $cropper = self.$cropper;
    const hidden = 'cropper-hidden';

    $cropper.addClass(hidden);
    $this.removeClass(hidden);

    $cropper.css((self.container = {
      width: Math.max($container.width(), Number(options.minContainerWidth) || 200),
      height: Math.max($container.height(), Number(options.minContainerHeight) || 100),
    }));

    $this.addClass(hidden);
    $cropper.removeClass(hidden);
  },

  // Canvas (image wrapper)
  initCanvas() {
    const self = this;
    const viewMode = self.options.viewMode;
    const container = self.container;
    const containerWidth = container.width;
    const containerHeight = container.height;
    const image = self.image;
    const imageNaturalWidth = image.naturalWidth;
    const imageNaturalHeight = image.naturalHeight;
    const is90Degree = Math.abs(image.rotate) % 180 === 90;
    const naturalWidth = is90Degree ? imageNaturalHeight : imageNaturalWidth;
    const naturalHeight = is90Degree ? imageNaturalWidth : imageNaturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;
    let canvasWidth = containerWidth;
    let canvasHeight = containerHeight;

    if (containerHeight * aspectRatio > containerWidth) {
      if (viewMode === 3) {
        canvasWidth = containerHeight * aspectRatio;
      } else {
        canvasHeight = containerWidth / aspectRatio;
      }
    } else if (viewMode === 3) {
      canvasHeight = containerWidth / aspectRatio;
    } else {
      canvasWidth = containerHeight * aspectRatio;
    }

    const canvas = {
      naturalWidth,
      naturalHeight,
      aspectRatio,
      width: canvasWidth,
      height: canvasHeight,
    };

    canvas.left = (containerWidth - canvasWidth) / 2;
    canvas.top = (containerHeight - canvasHeight) / 2;
    canvas.oldLeft = canvas.left;
    canvas.oldTop = canvas.top;

    self.canvas = canvas;
    self.limited = (viewMode === 1 || viewMode === 2);
    self.limitCanvas(true, true);
    self.initialImage = $.extend({}, image);
    self.initialCanvas = $.extend({}, canvas);
  },

  limitCanvas(isSizeLimited, isPositionLimited) {
    const self = this;
    const options = self.options;
    const viewMode = options.viewMode;
    const container = self.container;
    const containerWidth = container.width;
    const containerHeight = container.height;
    const canvas = self.canvas;
    const aspectRatio = canvas.aspectRatio;
    const cropBox = self.cropBox;
    const cropped = self.cropped && cropBox;

    if (isSizeLimited) {
      let minCanvasWidth = Number(options.minCanvasWidth) || 0;
      let minCanvasHeight = Number(options.minCanvasHeight) || 0;

      if (viewMode) {
        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, containerWidth);
          minCanvasHeight = Math.max(minCanvasHeight, containerHeight);

          if (viewMode === 3) {
            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
              minCanvasWidth = minCanvasHeight * aspectRatio;
            } else {
              minCanvasHeight = minCanvasWidth / aspectRatio;
            }
          }
        } else if (minCanvasWidth) {
          minCanvasWidth = Math.max(minCanvasWidth, cropped ? cropBox.width : 0);
        } else if (minCanvasHeight) {
          minCanvasHeight = Math.max(minCanvasHeight, cropped ? cropBox.height : 0);
        } else if (cropped) {
          minCanvasWidth = cropBox.width;
          minCanvasHeight = cropBox.height;

          if (minCanvasHeight * aspectRatio > minCanvasWidth) {
            minCanvasWidth = minCanvasHeight * aspectRatio;
          } else {
            minCanvasHeight = minCanvasWidth / aspectRatio;
          }
        }
      }

      if (minCanvasWidth && minCanvasHeight) {
        if (minCanvasHeight * aspectRatio > minCanvasWidth) {
          minCanvasHeight = minCanvasWidth / aspectRatio;
        } else {
          minCanvasWidth = minCanvasHeight * aspectRatio;
        }
      } else if (minCanvasWidth) {
        minCanvasHeight = minCanvasWidth / aspectRatio;
      } else if (minCanvasHeight) {
        minCanvasWidth = minCanvasHeight * aspectRatio;
      }

      canvas.minWidth = minCanvasWidth;
      canvas.minHeight = minCanvasHeight;
      canvas.maxWidth = Infinity;
      canvas.maxHeight = Infinity;
    }

    if (isPositionLimited) {
      if (viewMode) {
        const newCanvasLeft = containerWidth - canvas.width;
        const newCanvasTop = containerHeight - canvas.height;

        canvas.minLeft = Math.min(0, newCanvasLeft);
        canvas.minTop = Math.min(0, newCanvasTop);
        canvas.maxLeft = Math.max(0, newCanvasLeft);
        canvas.maxTop = Math.max(0, newCanvasTop);

        if (cropped && self.limited) {
          canvas.minLeft = Math.min(
            cropBox.left,
            (cropBox.left + cropBox.width) - canvas.width,
          );
          canvas.minTop = Math.min(
            cropBox.top,
            (cropBox.top + cropBox.height) - canvas.height,
          );
          canvas.maxLeft = cropBox.left;
          canvas.maxTop = cropBox.top;

          if (viewMode === 2) {
            if (canvas.width >= containerWidth) {
              canvas.minLeft = Math.min(0, newCanvasLeft);
              canvas.maxLeft = Math.max(0, newCanvasLeft);
            }

            if (canvas.height >= containerHeight) {
              canvas.minTop = Math.min(0, newCanvasTop);
              canvas.maxTop = Math.max(0, newCanvasTop);
            }
          }
        }
      } else {
        canvas.minLeft = -canvas.width;
        canvas.minTop = -canvas.height;
        canvas.maxLeft = containerWidth;
        canvas.maxTop = containerHeight;
      }
    }
  },

  renderCanvas(changed, transformed) {
    const { canvas, image } = this;

    if (transformed) {
      const { width: naturalWidth, height: naturalHeight } = utils.getRotatedSizes({
        width: image.naturalWidth * Math.abs(image.scaleX),
        height: image.naturalHeight * Math.abs(image.scaleY),
        degree: image.rotate,
      });

      const width = canvas.width * (naturalWidth / canvas.naturalWidth);
      const height = canvas.height * (naturalHeight / canvas.naturalHeight);

      canvas.left -= (width - canvas.width) / 2;
      canvas.top -= (height - canvas.height) / 2;
      canvas.width = width;
      canvas.height = height;
      canvas.aspectRatio = naturalWidth / naturalHeight;
      canvas.naturalWidth = naturalWidth;
      canvas.naturalHeight = naturalHeight;
      this.limitCanvas(true, false);
    }

    if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
      canvas.left = canvas.oldLeft;
    }

    if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
      canvas.top = canvas.oldTop;
    }

    canvas.width = Math.min(Math.max(canvas.width, canvas.minWidth), canvas.maxWidth);
    canvas.height = Math.min(Math.max(canvas.height, canvas.minHeight), canvas.maxHeight);

    this.limitCanvas(false, true);

    canvas.left = Math.min(Math.max(canvas.left, canvas.minLeft), canvas.maxLeft);
    canvas.top = Math.min(Math.max(canvas.top, canvas.minTop), canvas.maxTop);
    canvas.oldLeft = canvas.left;
    canvas.oldTop = canvas.top;

    this.$canvas.css({
      width: canvas.width,
      height: canvas.height,
      transform: utils.getTransform({
        translateX: canvas.left,
        translateY: canvas.top,
      }),
    });

    this.renderImage(changed);

    if (this.cropped && this.limited) {
      this.limitCropBox(true, true);
    }
  },

  renderImage(changed) {
    const { canvas, image } = this;
    const width = image.naturalWidth * (canvas.width / canvas.naturalWidth);
    const height = image.naturalHeight * (canvas.height / canvas.naturalHeight);

    $.extend(image, {
      width,
      height,
      left: (canvas.width - width) / 2,
      top: (canvas.height - height) / 2,
    });

    this.$clone.css({
      width: image.width,
      height: image.height,
      transform: utils.getTransform($.extend({
        translateX: image.left,
        translateY: image.top,
      }, image)),
    });

    if (changed) {
      this.output();
    }
  },

  initCropBox() {
    const self = this;
    const options = self.options;
    const canvas = self.canvas;
    const aspectRatio = options.aspectRatio;
    const autoCropArea = Number(options.autoCropArea) || 0.8;
    const cropBox = {
      width: canvas.width,
      height: canvas.height,
    };

    if (aspectRatio) {
      if (canvas.height * aspectRatio > canvas.width) {
        cropBox.height = cropBox.width / aspectRatio;
      } else {
        cropBox.width = cropBox.height * aspectRatio;
      }
    }

    self.cropBox = cropBox;
    self.limitCropBox(true, true);

    // Initialize auto crop area
    cropBox.width = Math.min(Math.max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
    cropBox.height = Math.min(Math.max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

    // The width of auto crop area must large than "minWidth", and the height too. (#164)
    cropBox.width = Math.max(cropBox.minWidth, cropBox.width * autoCropArea);
    cropBox.height = Math.max(cropBox.minHeight, cropBox.height * autoCropArea);
    cropBox.left = canvas.left + ((canvas.width - cropBox.width) / 2);
    cropBox.top = canvas.top + ((canvas.height - cropBox.height) / 2);
    cropBox.oldLeft = cropBox.left;
    cropBox.oldTop = cropBox.top;

    self.initialCropBox = $.extend({}, cropBox);
  },

  limitCropBox(isSizeLimited, isPositionLimited) {
    const self = this;
    const options = self.options;
    const aspectRatio = options.aspectRatio;
    const container = self.container;
    const containerWidth = container.width;
    const containerHeight = container.height;
    const canvas = self.canvas;
    const cropBox = self.cropBox;
    const limited = self.limited;

    if (isSizeLimited) {
      let minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
      let minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
      let maxCropBoxWidth = Math.min(containerWidth, limited ? canvas.width : containerWidth);
      let maxCropBoxHeight = Math.min(containerHeight, limited ? canvas.height : containerHeight);

      // The min/maxCropBoxWidth/Height must be less than containerWidth/Height
      minCropBoxWidth = Math.min(minCropBoxWidth, containerWidth);
      minCropBoxHeight = Math.min(minCropBoxHeight, containerHeight);

      if (aspectRatio) {
        if (minCropBoxWidth && minCropBoxHeight) {
          if (minCropBoxHeight * aspectRatio > minCropBoxWidth) {
            minCropBoxHeight = minCropBoxWidth / aspectRatio;
          } else {
            minCropBoxWidth = minCropBoxHeight * aspectRatio;
          }
        } else if (minCropBoxWidth) {
          minCropBoxHeight = minCropBoxWidth / aspectRatio;
        } else if (minCropBoxHeight) {
          minCropBoxWidth = minCropBoxHeight * aspectRatio;
        }

        if (maxCropBoxHeight * aspectRatio > maxCropBoxWidth) {
          maxCropBoxHeight = maxCropBoxWidth / aspectRatio;
        } else {
          maxCropBoxWidth = maxCropBoxHeight * aspectRatio;
        }
      }

      // The minWidth/Height must be less than maxWidth/Height
      cropBox.minWidth = Math.min(minCropBoxWidth, maxCropBoxWidth);
      cropBox.minHeight = Math.min(minCropBoxHeight, maxCropBoxHeight);
      cropBox.maxWidth = maxCropBoxWidth;
      cropBox.maxHeight = maxCropBoxHeight;
    }

    if (isPositionLimited) {
      if (limited) {
        cropBox.minLeft = Math.max(0, canvas.left);
        cropBox.minTop = Math.max(0, canvas.top);
        cropBox.maxLeft = Math.min(containerWidth, canvas.left + canvas.width) - cropBox.width;
        cropBox.maxTop = Math.min(containerHeight, canvas.top + canvas.height) - cropBox.height;
      } else {
        cropBox.minLeft = 0;
        cropBox.minTop = 0;
        cropBox.maxLeft = containerWidth - cropBox.width;
        cropBox.maxTop = containerHeight - cropBox.height;
      }
    }
  },

  renderCropBox() {
    const self = this;
    const options = self.options;
    const container = self.container;
    const containerWidth = container.width;
    const containerHeight = container.height;
    const cropBox = self.cropBox;

    if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
      cropBox.left = cropBox.oldLeft;
    }

    if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
      cropBox.top = cropBox.oldTop;
    }

    cropBox.width = Math.min(Math.max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
    cropBox.height = Math.min(Math.max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

    self.limitCropBox(false, true);

    cropBox.left = Math.min(
      Math.max(cropBox.left, cropBox.minLeft),
      cropBox.maxLeft,
    );
    cropBox.top = Math.min(
      Math.max(cropBox.top, cropBox.minTop),
      cropBox.maxTop,
    );
    cropBox.oldLeft = cropBox.left;
    cropBox.oldTop = cropBox.top;

    if (options.movable && options.cropBoxMovable) {
      // Turn to move the canvas when the crop box is equal to the container
      self.$face.data('action', (cropBox.width >= containerWidth && cropBox.height >= containerHeight) ? 'move' : 'all');
    }

    self.$cropBox.css({
      width: cropBox.width,
      height: cropBox.height,
      transform: utils.getTransform({
        translateX: cropBox.left,
        translateY: cropBox.top,
      }),
    });

    if (self.cropped && self.limited) {
      self.limitCanvas(true, true);
    }

    if (!self.disabled) {
      self.output();
    }
  },

  output() {
    const self = this;

    self.preview();

    if (self.completed) {
      self.trigger('crop', self.getData());
    }
  },
};
