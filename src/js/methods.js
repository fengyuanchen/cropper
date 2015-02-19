  $.extend(prototype, {
    reset: function () {
      if (!this.cropped || this.disabled) {
        return;
      }

      this.image = $.extend({}, this.defaultImage);
      this.renderImage();

      this.cropBox = $.extend({}, this.defaultCropBox);
      this.renderCropBox();
    },

    clear: function () {
      var cropBox = this.cropBox;

      if (!this.cropped || this.disabled) {
        return;
      }

      this.cropped = false;
      cropBox.left = 0;
      cropBox.top = 0;
      cropBox.width = 0;
      cropBox.height = 0;
      this.renderCropBox();

      this.$canvas.removeClass(CLASS_MODAL);
      this.$cropBox.addClass(CLASS_HIDDEN);
    },

    destroy: function () {
      var $this = this.$element;

      if (!this.ready) {
        this.$clone.off('load').remove();
      }

      this.unbuild();
      $this.removeClass(CLASS_HIDDEN).removeData('cropper');
    },

    replace: function (url) {
      var _this = this,
          $this = this.$element,
          canvas,
          context;

      if (!this.disabled && url && url !== this.url && url !== $this.attr('src')) {
        if ($this.is('img')) {
          $this.attr('src', url);
          this.load();
        } else if ($this.is('canvas') && support.canvas) {
          canvas = $this[0];
          context = canvas.getContext('2d');

          $('<img src="' + url + '"">').one('load', function () {
            canvas.width = this.width;
            canvas.height = this.height;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(this, 0, 0);
            _this.load();
          });
        }
      }
    },

    enable: function () {
      if (this.built) {
        this.disabled = false;
        this.$cropper.removeClass(CLASS_DISABLED);
      }
    },

    disable: function () {
      if (this.built) {
        this.disabled = true;
        this.$cropper.addClass(CLASS_DISABLED);
      }
    },

    move: function (offsetX, offsetY) {
      var image = this.image;

      if (!this.disabled && isNumber(offsetX) && isNumber(offsetY)) {
        image.left += offsetX
        image.top += offsetY;
        this.renderImage(true);
      }
    },

    zoom: function (delta) {
      var image = this.image,
          width,
          height;

      delta = num(delta);

      if (delta && this.built && !this.disabled && this.options.zoomable) {
        delta = delta <= -1 ? 1 / (1 - delta) : delta <= 1 ? (1 + delta) : delta;
        width = image.width * delta;
        height = image.height * delta;
        image.left -= (width - image.width) / 2;
        image.top -= (height - image.height) / 2;
        image.width = width;
        image.height = height;
        this.renderImage(true);
        this.setDragMode('move');
      }
    },

    rotate: function (degree) {
      var image = this.image;

      degree = num(degree) || 0;

      if (degree !== 0 && this.built && !this.disabled && this.options.rotatable) {
        image.rotate = (image.rotate + degree) % 360;
        this.renderImage(true);
      }
    },

    getData: function (rounded) {
      var cropBox = this.cropBox,
          image = this.image,
          rotate = image.rotate,
          ratio,
          data;

      if (this.built && this.cropped) {
        data = {
          x: cropBox.left - (rotate ? image.rotatedLeft : image.left),
          y: cropBox.top - (rotate ? image.rotatedTop : image.top),
          width: cropBox.width,
          height: cropBox.height
        };

        ratio = image.width / image.naturalWidth;

        $.each(data, function (i, n) {
          n = n / ratio;
          data[i] = rounded ? round(n) : n;
        });

        data.rotate = rotate;
      } else {
        data = {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          rotate: rotate
        }
      }

      return data;
    },

    getImageData: function (all) {
      var image = this.image,
          data = {};

      if (this.built) {
        $.extend(data, all ? image : {
          left: image.left,
          top: image.top,
          width: image.width,
          height: image.height
        });
      }

      return data;
    },

    setImageData: function (data) {
      var image = this.image;

      if (this.built && !this.disabled && $.isPlainObject(data)) {
        if (isNumber(data.left)) {
          image.left = data.left;
        }

        if (isNumber(data.top)) {
          image.top = data.top;
        }

        if (isNumber(data.width)) {
          image.width = data.width;
          image.height = image.width / image.aspectRatio;
        } else if (isNumber(data.height)) {
          image.height = data.height;
          image.width = image.height * image.aspectRatio;
        }

        this.renderImage(true);
      }
    },

    getCropBoxData: function () {
      var data = {},
          cropBox;

      if (this.cropped) {
        cropBox = this.cropBox;
        data = {
          left: cropBox.left,
          top: cropBox.top,
          width: cropBox.width,
          height: cropBox.height
        };
      }

      return data;
    },

    setCropBoxData: function (data) {
      var cropBox = this.cropBox,
          aspectRatio = this.options.aspectRatio;

      if (this.cropped && !this.disabled && $.isPlainObject(data)) {

        if (isNumber(data.left)) {
          cropBox.left = data.left;
        }

        if (isNumber(data.top)) {
          cropBox.top = data.top;
        }

        if (aspectRatio) {
          if (isNumber(data.width)) {
            cropBox.width = data.width;
            cropBox.height = cropBox.width / aspectRatio;
          } else if (isNumber(data.height)) {
            cropBox.height = data.height;
            cropBox.width = cropBox.height * aspectRatio;
          }
        } else {
          if (isNumber(data.width)) {
            cropBox.width = data.width;
          }

          if (isNumber(data.height)) {
            cropBox.height = data.height;
          }
        }

        this.renderCropBox();
      }
    },

    getDataURL: function (options, type, quality) {
      var originalWidth,
          originalHeight,
          canvasWidth,
          canvasHeight,
          scaledWidth,
          scaledHeight,
          scaled,
          canvas,
          context,
          data,
          dataURL;

      if (this.cropped && support.canvas) {
        data = this.getData();
        originalWidth = data.width;
        originalHeight = data.height;
        scaled = $.isPlainObject(options);

        if (scaled) {
          scaledWidth = options.width || originalWidth;
          scaledHeight = options.height || originalHeight;
        } else {
          quality = type;
          type = options;
        }

        canvasWidth = scaled ? scaledWidth : originalWidth;
        canvasHeight = scaled ? scaledHeight : originalHeight;

        canvas = $('<canvas>')[0]; // document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        context = canvas.getContext('2d');

        if (type === 'image/jpeg') {
          context.fillStyle = '#fff';
          context.fillRect(0, 0, canvasWidth, canvasHeight);
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
        context.drawImage.apply(context, (function () {
          var source = getSourceCanvas(this.$clone[0], this.image),
              sourceWidth = source.width,
              sourceHeight = source.height,
              args = [source],
              srcX = data.x, // source canvas
              srcY = data.y,
              srcWidth,
              srcHeight,
              dstX, // destination canvas
              dstY,
              dstWidth,
              dstHeight,
              scaledRatio;

          if (srcX <= -originalWidth || srcX > sourceWidth) {
            srcX = srcWidth = dstX = dstWidth = 0;
          } else if (srcX <= 0) {
            dstX = -srcX;
            srcX = 0;
            srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
          } else if (srcX <= sourceWidth) {
            dstX = 0;
            srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
          }

          if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
            srcY = srcHeight = dstY = dstHeight = 0;
          } else if (srcY <= 0) {
            dstY = -srcY;
            srcY = 0;
            srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
          } else if (srcY <= sourceHeight) {
            dstY = 0;
            srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
          }

          args.push(srcX, srcY, srcWidth, srcHeight);

          // Scale dstination sizes
          if (scaled) {
            scaledRatio = originalWidth / scaledWidth;
            dstX /= scaledRatio;
            dstY /= scaledRatio;
            dstWidth /= scaledRatio;
            dstHeight /= scaledRatio;
          }

          // Avoid "IndexSizeError" in IE and Firefox
          if (dstWidth > 0 && dstHeight > 0) {
            args.push(dstX, dstY, dstWidth, dstHeight);
          }

          return args;
        }).call(this));

        dataURL = canvas.toDataURL.apply(canvas, (function () {
          var args = [];

          if (isString(type)) {
            args.push(type);
          }

          if (isNumber(quality)) {
            args.push(quality);
          }

          return args;
        }).call(this));
      }

      return dataURL || '';
    },

    setAspectRatio: function (aspectRatio) {
      var options = this.options;

      if (!this.disabled && !isUndefined(aspectRatio)) {
        options.aspectRatio = abs(num(aspectRatio)) || NaN; // 0 -> NaN

        if (this.built) {
          this.initCropBox();
        }
      }
    },

    setDragMode: function (mode) {
      var $canvas = this.$canvas,
          cropable = false,
          movable = false;

      if (!this.ready || this.disabled) {
        return;
      }

      switch (mode) {
        case 'crop':
          if (this.options.dragCrop) {
            cropable = true;
            $canvas.data(STRING_DIRECTIVE, mode);
          } else {
            movable = true;
          }

          break;

        case 'move':
          movable = true;
          $canvas.data(STRING_DIRECTIVE, mode);

          break;

        default:
          $canvas.removeData(STRING_DIRECTIVE);
      }

      $canvas.toggleClass(CLASS_CROP, cropable).toggleClass(CLASS_MOVE, movable);
    }
  });
