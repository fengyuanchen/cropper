  $.extend(prototype, {
    initPreview: function () {
      var options = this.options;
      var crossOrigin = '';
      var url = this.url;

      if (options.checkImageOrigin && isCrossOriginURL(url)) {
        crossOrigin = ' crossOrigin="anonymous"';
      }

      this.$preview = $(this.options.preview);
      this.$viewBox.html('<img' + crossOrigin + ' src="' + url + '">');
      this.$preview.each(function () {
        var $this = $(this);

        // Save the original size for recover
        $this.data(DATA_PREVIEW, {
          width: $this.width(),
          height: $this.height(),
          original: $this.html()
        });

        /**
         * Override img element styles
         * Add `display:block` to avoid margin top issue
         * (Occur only when margin-top <= -height)
         */
        $this.html(
          '<img' + crossOrigin + ' src="' + url + '" style="display:block;width:100%;height:auto;' +
          'min-width:0!important;min-height:0!important;' +
          'max-width:none!important;max-height:none!important;' +
          'image-orientation:0deg!important">'
        );
      });
    },

    resetPreview: function () {
      this.$preview.each(function () {
        var $this = $(this);

        $this.html($this.data(DATA_PREVIEW).original).removeData(DATA_PREVIEW);
      });
    },

    preview: function () {
      var image = this.image;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
      var cropBoxWidth = cropBox.width;
      var cropBoxHeight = cropBox.height;
      var width = image.width;
      var height = image.height;
      var left = cropBox.left - canvas.left - image.left;
      var top = cropBox.top - canvas.top - image.top;

      if (!this.cropped || this.disabled) {
        return;
      }

      this.$viewBox.find('img').css({
        width: width,
        height: height,
        marginLeft: -left,
        marginTop: -top,
        transform: getTransform(image)
      });

      this.$preview.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_PREVIEW);
        var originalWidth = data.width;
        var originalHeight = data.height;
        var newWidth = originalWidth;
        var newHeight = originalHeight;
        var ratio = 1;

        if (cropBoxWidth) {
          ratio = originalWidth / cropBoxWidth;
          newHeight = cropBoxHeight * ratio;
        }

        if (cropBoxHeight && newHeight > originalHeight) {
          ratio = originalHeight / cropBoxHeight;
          newWidth = cropBoxWidth * ratio;
          newHeight = originalHeight;
        }

        $this.width(newWidth).height(newHeight).find('img').css({
          width: width * ratio,
          height: height * ratio,
          marginLeft: -left * ratio,
          marginTop: -top * ratio,
          transform: getTransform(image)
        });
      });
    }
  });
