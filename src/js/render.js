import $ from 'jquery';
import {
  ACTION_ALL,
  ACTION_MOVE,
  CLASS_HIDDEN,
  DATA_ACTION,
  EVENT_CROP,
} from './constants';
import {
  getContainSizes,
  getRotatedSizes,
  getTransformValues,
} from './utilities';

export default {
  render() {
    this.initContainer();
    this.initCanvas();
    this.initCropBox();
    this.renderCanvas();

    if (this.cropped) {
      this.renderCropBox();
    }
  },

  initContainer() {
    const {
      $element,
      options,
      $container,
      $cropper,
    } = this;

    $cropper.addClass(CLASS_HIDDEN);
    $element.removeClass(CLASS_HIDDEN);

    $cropper.css((this.container = {
      width: Math.max(
        $container.width(),
        Number(options.minContainerWidth) || 200,
      ),
      height: Math.max(
        $container.height(),
        Number(options.minContainerHeight) || 100,
      ),
    }));

    $element.addClass(CLASS_HIDDEN);
    $cropper.removeClass(CLASS_HIDDEN);
  },

  // Canvas (image wrapper)
  initCanvas() {
    const { container, image } = this;
    const { viewMode } = this.options;
    const rotated = Math.abs(image.rotate) % 180 === 90;
    const naturalWidth = rotated ? image.naturalHeight : image.naturalWidth;
    const naturalHeight = rotated ? image.naturalWidth : image.naturalHeight;
    const aspectRatio = naturalWidth / naturalHeight;
    let canvasWidth = container.width;
    let canvasHeight = container.height;

    if (container.height * aspectRatio > container.width) {
      if (viewMode === 3) {
        canvasWidth = container.height * aspectRatio;
      } else {
        canvasHeight = container.width / aspectRatio;
      }
    } else if (viewMode === 3) {
      canvasHeight = container.width / aspectRatio;
    } else {
      canvasWidth = container.height * aspectRatio;
    }

    const canvas = {
      aspectRatio,
      naturalWidth,
      naturalHeight,
      width: canvasWidth,
      height: canvasHeight,
    };

    canvas.left = (container.width - canvasWidth) / 2;
    canvas.top = (container.height - canvasHeight) / 2;
    canvas.oldLeft = canvas.left;
    canvas.oldTop = canvas.top;

    this.canvas = canvas;
    this.limited = (viewMode === 1 || viewMode === 2);
    this.limitCanvas(true, true);
    this.initialImage = $.extend({}, image);
    this.initialCanvas = $.extend({}, canvas);
  },

  limitCanvas(isSizeLimited, isPositionLimited) {
    const {
      options,
      container,
      canvas,
      cropBox,
    } = this;
    const { viewMode } = options;
    const { aspectRatio } = canvas;
    const cropped = this.cropped && cropBox;

    if (isSizeLimited) {
      let minCanvasWidth = Number(options.minCanvasWidth) || 0;
      let minCanvasHeight = Number(options.minCanvasHeight) || 0;

      if (viewMode > 0) {
        if (viewMode > 1) {
          minCanvasWidth = Math.max(minCanvasWidth, container.width);
          minCanvasHeight = Math.max(minCanvasHeight, container.height);

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

      ({ width: minCanvasWidth, height: minCanvasHeight } = getContainSizes({
        aspectRatio,
        width: minCanvasWidth,
        height: minCanvasHeight,
      }));

      canvas.minWidth = minCanvasWidth;
      canvas.minHeight = minCanvasHeight;
      canvas.maxWidth = Infinity;
      canvas.maxHeight = Infinity;
    }

    if (isPositionLimited) {
      if (viewMode > 0) {
        const newCanvasLeft = container.width - canvas.width;
        const newCanvasTop = container.height - canvas.height;

        canvas.minLeft = Math.min(0, newCanvasLeft);
        canvas.minTop = Math.min(0, newCanvasTop);
        canvas.maxLeft = Math.max(0, newCanvasLeft);
        canvas.maxTop = Math.max(0, newCanvasTop);

        if (cropped && this.limited) {
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
            if (canvas.width >= container.width) {
              canvas.minLeft = Math.min(0, newCanvasLeft);
              canvas.maxLeft = Math.max(0, newCanvasLeft);
            }

            if (canvas.height >= container.height) {
              canvas.minTop = Math.min(0, newCanvasTop);
              canvas.maxTop = Math.max(0, newCanvasTop);
            }
          }
        }
      } else {
        canvas.minLeft = -canvas.width;
        canvas.minTop = -canvas.height;
        canvas.maxLeft = container.width;
        canvas.maxTop = container.height;
      }
    }
  },

  renderCanvas(changed, transformed) {
    const { canvas, image } = this;

    if (transformed) {
      const { width: naturalWidth, height: naturalHeight } = getRotatedSizes({
        width: image.naturalWidth * Math.abs(image.scaleX || 1),
        height: image.naturalHeight * Math.abs(image.scaleY || 1),
        degree: image.rotate || 0,
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
      transform: getTransformValues({
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
      transform: getTransformValues($.extend({
        translateX: image.left,
        translateY: image.top,
      }, image)),
    });

    if (changed) {
      this.output();
    }
  },

  initCropBox() {
    const { options, canvas } = this;
    const { aspectRatio } = options;
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

    this.cropBox = cropBox;
    this.limitCropBox(true, true);

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

    this.initialCropBox = $.extend({}, cropBox);
  },

  limitCropBox(isSizeLimited, isPositionLimited) {
    const {
      options,
      container,
      canvas,
      cropBox,
      limited,
    } = this;
    const { aspectRatio } = options;

    if (isSizeLimited) {
      let minCropBoxWidth = Number(options.minCropBoxWidth) || 0;
      let minCropBoxHeight = Number(options.minCropBoxHeight) || 0;
      let maxCropBoxWidth = Math.min(container.width, limited ? canvas.width : container.width);
      let maxCropBoxHeight = Math.min(container.height, limited ? canvas.height : container.height);

      // The min/maxCropBoxWidth/Height must be less than container's width/Height
      minCropBoxWidth = Math.min(minCropBoxWidth, container.width);
      minCropBoxHeight = Math.min(minCropBoxHeight, container.height);

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
        cropBox.maxLeft = Math.min(container.width, canvas.left + canvas.width) - cropBox.width;
        cropBox.maxTop = Math.min(container.height, canvas.top + canvas.height) - cropBox.height;
      } else {
        cropBox.minLeft = 0;
        cropBox.minTop = 0;
        cropBox.maxLeft = container.width - cropBox.width;
        cropBox.maxTop = container.height - cropBox.height;
      }
    }
  },

  renderCropBox() {
    const { options, container, cropBox } = this;

    if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
      cropBox.left = cropBox.oldLeft;
    }

    if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
      cropBox.top = cropBox.oldTop;
    }

    cropBox.width = Math.min(Math.max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
    cropBox.height = Math.min(Math.max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

    this.limitCropBox(false, true);

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
      this.$face.data(DATA_ACTION, (cropBox.width >= container.width &&
        cropBox.height >= container.height) ? ACTION_MOVE : ACTION_ALL);
    }

    this.$cropBox.css({
      width: cropBox.width,
      height: cropBox.height,
      transform: getTransformValues({
        translateX: cropBox.left,
        translateY: cropBox.top,
      }),
    });

    if (this.cropped && this.limited) {
      this.limitCanvas(true, true);
    }

    if (!this.disabled) {
      this.output();
    }
  },

  output() {
    this.preview();

    if (this.completed) {
      this.trigger(EVENT_CROP, this.getData());
    }
  },
};
