  $.extend(prototype, {
    render: function () {
      this.initContainer();
      this.initCanvas();
      this.initCropBox();
    },

    initContainer: function () {
      var $this = this.$element,
          $container = this.$container,
          $cropper = this.$cropper,
          options = this.options;

      $cropper.addClass(CLASS_HIDDEN);
      $this.removeClass(CLASS_HIDDEN);

      $cropper.css((this.container = {
        width: max($container.width(), num(options.minContainerWidth) || 300),
        height: max($container.height(), num(options.minContainerHeight) || 150)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    // image wrapping box
    initCanvas: function () {
      var options = this.options,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          image = this.image,
          aspectRatio = image.aspectRatio,
          canvas = {
            aspectRatio: aspectRatio,
            width: containerWidth,
            height: containerHeight,
            left: 0,
            top: 0,
            minLeft: -containerWidth,
            minTop: -containerHeight,
            maxLeft: containerWidth,
            maxTop: containerHeight,
            minWidth: 0,
            minHeight: 0,
            maxWidth: Infinity,
            maxHeight: Infinity
          };

      if (containerHeight * aspectRatio > containerWidth) {
        if (options.strict) {
          canvas.width = containerHeight * aspectRatio;
        } else {
          canvas.height = containerWidth / aspectRatio;
        }
      } else {
        if (options.strict) {
          canvas.height = containerWidth / aspectRatio;
        } else {
          canvas.width = containerHeight * aspectRatio;
        }
      }

      image.initialWidth = canvas.width;
      image.initialHeight = canvas.height;

      this.initialCanvas = $.extend({}, canvas);
      this.canvas = canvas;
      this.limitCanvas();
      this.renderCanvas();
    },

    limitCanvas: function () {
      var options = this.options,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
          canvas = this.canvas,
          aspectRatio = canvas.aspectRatio,
          minWidth = containerWidth,
          minHeight = containerHeight;

      if (containerHeight * aspectRatio > containerWidth) {
        if (options.strict) {
          minWidth = containerHeight * aspectRatio;
        } else {
          minHeight = containerWidth / aspectRatio;
        }
      } else {
        if (options.strict) {
          minHeight = containerWidth / aspectRatio;
        } else {
          minWidth = containerHeight * aspectRatio;
        }
      }

      if (options.strict) {
        canvas.left = (containerWidth - minWidth) / 2;
        canvas.top = (containerHeight - minHeight) / 2;
        canvas.minWidth = minWidth;
        canvas.minHeight = minHeight;
        canvas.maxLeft = 0;
        canvas.maxTop = 0;
        canvas.minLeft = canvas.left * 2;
        canvas.minTop = canvas.top * 2;
      } else {
        canvas.minLeft = -minWidth;
        canvas.minTop = -minHeight;
      }
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
          width: image.initialWidth,
          height: image.initialHeight,
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

      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

      if (options.strict) {
        canvas.minLeft = container.width - canvas.width;
        canvas.minTop = container.height - canvas.height;
      } else {
        canvas.minLeft = -canvas.width;
        canvas.minTop = -canvas.height;
      }

      canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
      canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

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

        $.extend(image, {
          width: reversed.width,
          height: reversed.height,
          left: (canvas.width - reversed.width) / 2,
          top: (canvas.height - reversed.height) / 2
        });
      } else {
        $.extend(image, {
          width: canvas.width,
          height: canvas.height,
          left: 0,
          top: 0
        });
      }

      this.$clone.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getRotateValue(image.rotate)
      });

      if (changed) {
        this.preview();
        options.crop && options.crop.call(this.$element, this.getData());
      }
    },

    initCropBox: function () {
      var options = this.options,
          container = this.container,
          canvas = this.canvas,
          aspectRatio = options.aspectRatio,
          containerWidth = container.width,
          containerHeight = container.height,
          minCropBoxWidth = abs(num(options.minCropBoxWidth)) || 0,
          minCropBoxHeight = abs(num(options.minCropBoxHeight)) || 0,
          autoCropArea = abs(num(options.autoCropArea)) || 0.8,
          cropBox = {
            width: canvas.width,
            height: canvas.height,
            minWidth: minCropBoxWidth,
            minHeight: minCropBoxHeight,
            maxWidth: containerWidth,
            maxHeight: containerHeight
          };

      if (aspectRatio) {
        if (containerHeight * aspectRatio > containerWidth) {
          cropBox.height = canvas.width / aspectRatio;
          cropBox.maxHeight = containerWidth / aspectRatio;
        } else {
          cropBox.width = canvas.height * aspectRatio;
          cropBox.maxWidth = containerHeight * aspectRatio;
        }

        if (minCropBoxWidth) {
          cropBox.minHeight = cropBox.minWidth / aspectRatio;
        } else if (minCropBoxHeight) {
          cropBox.minWidth = cropBox.minHeight * aspectRatio;
        }
      }

      // The "minWidth" must be less than "maxWidth", and the "minHeight" too.
      cropBox.minWidth = min(cropBox.maxWidth, cropBox.minWidth);
      cropBox.minHeight = min(cropBox.maxHeight, cropBox.minHeight);

      // The width of auto crop area must large than "minWidth", and the height too. (#164)
      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
      cropBox.oldLeft = cropBox.left = (containerWidth - cropBox.width) / 2;
      cropBox.oldTop = cropBox.top = (containerHeight - cropBox.height) / 2;

      this.initialCropBox = $.extend({}, cropBox);
      this.cropBox = cropBox;

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    renderCropBox: function () {
      var options = this.options,
          container = this.container,
          containerWidth = container.width,
          containerHeight = container.height,
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
      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, 0), containerWidth - cropBox.width);
      cropBox.oldTop = cropBox.top = min(max(cropBox.top, 0), containerHeight - cropBox.height);

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
        $.isFunction(options.crop) && options.crop.call(this.$element, this.getData());
      }
    }
  });
