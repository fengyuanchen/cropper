  $.extend(prototype, {
    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();

      this.renderCanvas();

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    initContainer: function () {
      var $this = this.$element,
          $container = this.$container,
          $cropper = this.$cropper,
          options = this.options;

      $cropper.addClass(CLASS_HIDDEN);
      $this.removeClass(CLASS_HIDDEN);

      $cropper.css((this.container = {
        width: max($container.width(), num(options.minContainerWidth) || 200),
        height: max($container.height(), num(options.minContainerHeight) || 100)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    // image wrapper
    initCanvas: function () {
      var container = this.container,
          image = this.image,
          canvas = {
            aspectRatio: image.aspectRatio,
            width: container.width,
            height: container.height
          };

      if (container.height * image.aspectRatio > container.width) {
        canvas.height = container.width / image.aspectRatio;
      } else {
        canvas.width = container.height * image.aspectRatio;
      }

      canvas.oldLeft = canvas.left = (container.width - canvas.width) / 2;
      canvas.oldTop = canvas.top = (container.height - canvas.height) / 2;

      this.canvas = canvas;
      this.limitCanvas();
      this.initialImage = $.extend({}, image);
      this.initialCanvas = $.extend({}, this.canvas);
    },

    limitCanvas: function () {
      var options = this.options,
          container = this.container,
          canvas = this.canvas,
          minCanvasWidth = num(options.minCanvasWidth) || 0,
          minCanvasHeight = num(options.minCanvasHeight) || 0;

      if (minCanvasWidth) {
        minCanvasHeight = minCanvasWidth / canvas.aspectRatio;
      } else if (minCanvasHeight) {
        minCanvasWidth = minCanvasHeight * canvas.aspectRatio;
      } else if (options.strict) {
        if (container.height * canvas.aspectRatio > container.width) {
          minCanvasWidth = container.width;
          minCanvasHeight = container.width / canvas.aspectRatio;
        } else {
          minCanvasWidth = container.height * canvas.aspectRatio;
          minCanvasHeight = container.height;
        }
      }

      $.extend(canvas, {
        minWidth: minCanvasWidth,
        minHeight: minCanvasHeight,
        maxWidth: Infinity,
        maxHeight: Infinity
      });
    },

    renderCanvas: function (changed) {
      var options = this.options,
          container = this.container,
          canvas = this.canvas,
          image = this.image,
          aspectRatio,
          reversed,
          rotated;

      if (this.rotated) {
        this.rotated = false;

        // Computes rotatation sizes with initial image sizes
        rotated = getRotatedSizes({
          width: image.width,
          height: image.height,
          degree: image.rotate
        });

        aspectRatio = rotated.width / rotated.height;

        if (aspectRatio !== canvas.aspectRatio) {
          canvas.left -= (rotated.width - canvas.width) / 2;
          canvas.top -= (rotated.height - canvas.height) / 2;
          canvas.width = rotated.width;
          canvas.height = rotated.height;
          canvas.aspectRatio = aspectRatio;
          this.limitCanvas();
        }
      }

      if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
        canvas.left = canvas.oldLeft;
      }

      if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
        canvas.top = canvas.oldTop;
      }

      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

      if (options.strict) {
        canvas.minLeft = min(0, container.width - canvas.width);
        canvas.minTop = min(0, container.height - canvas.height);
        canvas.maxLeft = max(0, container.width - canvas.width);
        canvas.maxTop = max(0, container.height - canvas.height);
      } else {
        canvas.minLeft = -canvas.width;
        canvas.minTop = -canvas.height;
        canvas.maxLeft = container.width;
        canvas.maxTop = container.height;
      }

      canvas.oldLeft = canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
      canvas.oldTop = canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

      this.$canvas.css({
        width: canvas.width,
        height: canvas.height,
        left: canvas.left,
        top: canvas.top
      });

      if (image.rotate) {
        reversed = getRotatedSizes({
          width: canvas.width,
          height: canvas.height,
          degree: image.rotate,
          aspectRatio: image.aspectRatio
        }, true);
      }

      $.extend(image, reversed ? {
        width: reversed.width,
        height: reversed.height,
        left: (canvas.width - reversed.width) / 2,
        top: (canvas.height - reversed.height) / 2
      } : {
        width: canvas.width,
        height: canvas.height,
        left: 0,
        top: 0
      });

      this.$clone.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getRotateValue(image.rotate)
      });

      if (options.strict) {
        this.limitCropBox();

        if (this.cropped) {
          this.renderCropBox();
        }
      }

      if (changed) {
        this.preview();

        if (options.crop) {
          options.crop.call(this.$element, this.getData());
        }
      }
    },

    initCropBox: function () {
      var options = this.options,
          canvas = this.canvas,
          aspectRatio = options.aspectRatio,
          autoCropArea = num(options.autoCropArea) || 0.8,
          cropBox = {
            width: canvas.width,
            height: canvas.height
          };

      if (aspectRatio) {
        if (canvas.height * aspectRatio > canvas.width) {
          cropBox.height = cropBox.width / aspectRatio;
        } else {
          cropBox.width = cropBox.height * aspectRatio;
        }
      }

      this.cropBox = cropBox;
      this.limitCropBox();

      // Initialize auto crop area
      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      // The width of auto crop area must large than "minWidth", and the height too. (#164)
      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
      cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
      cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;

      this.initialCropBox = $.extend({}, cropBox);
    },

    limitCropBox: function () {
      var options = this.options,
          container = this.container,
          canvas = this.canvas,
          cropBox = this.cropBox,
          aspectRatio = options.aspectRatio,
          minCropBoxWidth = num(options.minCropBoxWidth) || 0,
          minCropBoxHeight = num(options.minCropBoxHeight) || 0;

      // min/maxCropBoxWidth/Height must less than conatiner width/height
      cropBox.minWidth = min(container.width, minCropBoxWidth);
      cropBox.minHeight = min(container.height, minCropBoxHeight);
      cropBox.maxWidth = min(container.width, options.strict ? canvas.width : container.width);
      cropBox.maxHeight = min(container.height, options.strict ? canvas.height : container.height);

      if (aspectRatio) {
        // compare crop box size with container first
        if (cropBox.maxHeight * aspectRatio > cropBox.maxWidth) {
          cropBox.minHeight = cropBox.minWidth / aspectRatio;
          cropBox.maxHeight = cropBox.maxWidth / aspectRatio;
        } else {
          cropBox.minWidth = cropBox.minHeight * aspectRatio;
          cropBox.maxWidth = cropBox.maxHeight * aspectRatio;
        }
      }

      // The "minWidth" must be less than "maxWidth", and the "minHeight" too.
      cropBox.minWidth = min(cropBox.maxWidth, cropBox.minWidth);
      cropBox.minHeight = min(cropBox.maxHeight, cropBox.minHeight);
    },

    renderCropBox: function () {
      var options = this.options,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          canvas = this.canvas,
          $cropBox = this.$cropBox,
          cropBox = this.cropBox;

      if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
        cropBox.left = cropBox.oldLeft;
      }

      if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
        cropBox.top = cropBox.oldTop;
      }

      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

      if (options.strict) {
        cropBox.minLeft = max(0, canvas.left);
        cropBox.minTop = max(0, canvas.top);
        cropBox.maxLeft = cropBox.minLeft + (min(container.width, canvas.width) - cropBox.width);
        cropBox.maxTop = cropBox.minTop + (min(container.height, canvas.height) - cropBox.height);
      } else {
        cropBox.minLeft = 0;
        cropBox.minTop = 0;
        cropBox.maxLeft = container.width - cropBox.width;
        cropBox.maxTop = container.height - cropBox.height;
      }

      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
      cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

      if (options.movable) {
        $cropBox.find('.cropper-face').data('drag', (cropBox.width === containerWidth && cropBox.height === containerHeight) ? 'move' : 'all');
      }

      $cropBox.css({
        width: cropBox.width,
        height: cropBox.height,
        left: cropBox.left,
        top: cropBox.top
      });

      if (!this.disabled) {
        this.preview();

        if (options.crop) {
          options.crop.call(this.$element, this.getData());
        }
      }
    }
  });
