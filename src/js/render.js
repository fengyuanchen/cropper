  $.extend(prototype, {
    render: function () {
      this.initContainer();
      this.initImage();
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
        width: max($container.width(), num(options.minContainerWidth) || 350),
        height: max($container.height(), num(options.minContainerHeight) || 150)
      }));

      $this.addClass(CLASS_HIDDEN);
      $cropper.removeClass(CLASS_HIDDEN);
    },

    initImage: function () {
      var container = this.container,
          image = this.image,
          aspectRatio = image.aspectRatio,
          containerWidth = container.width,
          containerHeight = container.height,
          width = image.naturalWidth,
          height = image.naturalHeight,
          left = 0,
          top = 0;

      if (containerHeight * aspectRatio > containerWidth) {
        width = containerWidth;
        height = width / aspectRatio;
        top = (containerHeight - height) / 2;
      } else {
        height = containerHeight;
        width = height * aspectRatio;
        left = (containerWidth - width) / 2;
      }

      $.extend(image, {
        width: width,
        height: height,
        left: left,
        top: top
      });

      this.defaultImage = $.extend({}, image);
      this.renderImage();
    },

    renderImage: function (changed) {
      var options = this.options,
          image = this.image,
          width = image.width,
          height = image.height,
          rotate = image.rotate,
          rotated;

      if (rotate) {
        rotated = getRotatedSizes({
          width: width,
          height: height,
          degree: rotate
        });
      }

      $.extend(image, {
        rotatedWidth: rotated ? rotated.width : image.width,
        rotatedHeight: rotated ? rotated.height : image.height,
        rotatedLeft: rotated ? (image.left - (rotated.width - width) / 2) : image.left,
        rotatedTop: rotated ? (image.top - (rotated.height - height) / 2) : image.top
      });

      this.$clone.css({
        width: width,
        height: height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getRotateValue(rotate)
      });

      if (changed) {
        this.preview();
        $.isFunction(options.crop) && options.crop.call(this.$element, this.getData());
      }
    },

    initCropBox: function () {
      var options = this.options,
          container = this.container,
          image = this.image,
          aspectRatio = options.aspectRatio,
          containerWidth = container.width,
          containerHeight = container.height,
          minCropBoxWidth = abs(num(options.minCropBoxWidth)) || 0,
          minCropBoxHeight = abs(num(options.minCropBoxHeight)) || 0,
          autoCropArea = abs(num(options.autoCropArea)) || 0.8,
          cropBox = {
            width: image.width,
            height: image.height,
            minWidth: minCropBoxWidth,
            minHeight: minCropBoxHeight,
            maxWidth: containerWidth,
            maxHeight: containerHeight
          };

      if (aspectRatio) {
        if (containerHeight * aspectRatio > containerWidth) {
          cropBox.height = cropBox.width / aspectRatio;
          cropBox.maxHeight = containerWidth / aspectRatio;
        } else {
          cropBox.width = image.height * aspectRatio;
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
      cropBox.left = (containerWidth - cropBox.width) / 2;
      cropBox.top = (containerHeight - cropBox.height) / 2;

      cropBox.oldLeft = cropBox.left;
      cropBox.oldTop = cropBox.top;

      this.defaultCropBox = $.extend({}, cropBox);
      this.cropBox = cropBox;

      if (this.cropped) {
        this.renderCropBox();
      }
    },

    renderCropBox: function () {
      var options = this.options,
          container = this.container,
          $cropBox = this.$cropBox,
          cropBox = this.cropBox;

      if (cropBox.width > cropBox.maxWidth) {
        cropBox.width = cropBox.maxWidth;
        cropBox.left = cropBox.oldLeft;
      } else if (cropBox.width < cropBox.minWidth) {
        cropBox.width = cropBox.minWidth;
        cropBox.left = cropBox.oldLeft;
      }

      if (cropBox.height > cropBox.maxHeight) {
        cropBox.height = cropBox.maxHeight;
        cropBox.top = cropBox.oldTop;
      } else if (cropBox.height < cropBox.minHeight) {
        cropBox.height = cropBox.minHeight;
        cropBox.top = cropBox.oldTop;
      }

      cropBox.left = min(max(cropBox.left, 0), container.width - cropBox.width);
      cropBox.top = min(max(cropBox.top, 0), container.height - cropBox.height);

      cropBox.oldLeft = cropBox.left;
      cropBox.oldTop = cropBox.top;

      if (options.movable) {
        $cropBox.find('.cropper-face').data(STRING_DIRECTIVE, (cropBox.width === container.width && cropBox.height === container.height) ? 'move' : 'all');
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
