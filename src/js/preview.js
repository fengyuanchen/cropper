  $.extend(prototype, {
    initPreview: function () {
      var url = this.url;

      this.$preview = $(this.options.preview);
      this.$viewBox.html('<img src="' + url + '">');
      this.$preview.each(function () {
        var $this = $(this);

        // Save the original size for recover
        $this.data(PREVIEW, {
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
          '<img src="' + url + '" style="display:block;width:100%;' +
          'min-width:0!important;min-height:0!important;' +
          'max-width:none!important;max-height:none!important;' +
          'image-orientation:0deg!important">'
        );
      });
    },

    resetPreview: function () {
      this.$preview.each(function () {
        var $this = $(this);

        $this.html($this.data(PREVIEW).original).removeData(PREVIEW);
      });
    },

    preview: function () {
      var image = this.image;
      var canvas = this.canvas;
      var cropBox = this.cropBox;
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
        var data = $this.data(PREVIEW);
        var ratio = data.width / cropBox.width;
        var newWidth = data.width;
        var newHeight = cropBox.height * ratio;

        if (newHeight > data.height) {
          ratio = data.height / cropBox.height;
          newWidth = cropBox.width * ratio;
          newHeight = data.height;
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
