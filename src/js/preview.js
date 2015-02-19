  prototype.initPreview = function () {
    var url = this.url;

    this.$preview = $(this.options.preview);
    this.$viewer.html('<img src="' + url + '">');

    // Override img element styles
    // Add `display:block` to avoid margin top issue (Occur only when margin-top <= -height)
    this.$preview.each(function () {
      var $this = $(this);

      $this.data({
        width: $this.width(),
        height: $this.height()
      }).html('<img src="' + url + '" style="display:block;width:100%;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;">');
    });
  };

  prototype.preview = function () {
    var image = this.image,
        cropBox = this.cropBox,
        width = image.width,
        height = image.height,
        left = cropBox.left - image.left,
        top = cropBox.top - image.top,
        rotate = image.rotate;

    if (!this.cropped || this.disabled) {
      return;
    }

    this.$viewer.find('img').css({
      width: width,
      height: height,
      marginLeft: -left,
      marginTop: -top,
      transform: getRotateValue(rotate)
    });

    this.$preview.each(function () {
      var $this = $(this),
          data = $this.data(),
          ratio = data.width / cropBox.width,
          newWidth = data.width,
          newHeight = cropBox.height * ratio;

      if (newHeight > data.height) {
        ratio = data.height / cropBox.height,
        newWidth = cropBox.width * ratio;
        newHeight = data.height;
      }

      $this.width(newWidth).height(newHeight).find('img').css({
        width: width * ratio,
        height: height * ratio,
        marginLeft: -left * ratio,
        marginTop: -top * ratio,
        transform: getRotateValue(rotate)
      });
    });
  };
