  prototype.build = function () {
    var $this = this.$element,
        options = this.options,
        $cropper,
        $cropBox;

    if (!this.ready) {
      return;
    }

    if (this.built) {
      this.unbuild();
    }

    // Create cropper elements
    this.$cropper = $cropper = $(Cropper.TEMPLATE);

    // Hide the original image
    $this.addClass(CLASS_HIDDEN);

    // Show and prepend the clone iamge to the cropper
    this.$clone.removeClass(CLASS_HIDE).prependTo($cropper);

    this.$container = $this.parent();
    this.$container.append($cropper);

    this.$canvas = $cropper.find('.cropper-canvas');
    this.$cropBox = $cropBox = $cropper.find('.cropper-cropbox');
    this.$viewer = $cropper.find('.cropper-viewer');

    this.addListeners();
    this.initPreview();

    // Format aspect ratio
    options.aspectRatio = abs(num(options.aspectRatio)) || NaN; // 0 -> NaN, 'auto' -> NaN

    if (options.autoCrop) {
      this.cropped = true;
      options.modal && this.$canvas.addClass(CLASS_MODAL);
    } else {
      $cropBox.addClass(CLASS_HIDDEN);
    }

    options.background && $cropper.addClass(CLASS_BG);
    !options.highlight && $cropBox.find('.cropper-face').addClass(CLASS_INVISIBLE);
    !options.guides && $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
    !options.movable && $cropBox.find('.cropper-face').data(STRING_DIRECTIVE, 'move');
    !options.resizable && $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
    this.setDragMode(options.dragCrop ? 'crop' : 'move');

    this.built = true;
    this.render();
    $this.one(EVENT_BUILT, options.built).trigger(EVENT_BUILT); // Only trigger once
  };

  prototype.unbuild = function () {
    if (!this.built) {
      return;
    }

    this.built = false;
    this.removeListeners();

    this.$preview.empty();
    this.$preview = null;

    this.$cropBox = null;
    this.$canvas = null;
    this.$container = null;

    this.$cropper.remove();
    this.$cropper = null;
  };
