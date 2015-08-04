  $.extend(prototype, {
    resize: function () {
      var $container = this.$container;
      var container = this.container;
      var canvasData;
      var cropBoxData;
      var ratio;

      // Check `container` is necessary for IE8
      if (this.disabled || !container) {
        return;
      }

      ratio = $container.width() / container.width;

      // Resize when width changed or height changed
      if (ratio !== 1 || $container.height() !== container.height) {
        canvasData = this.getCanvasData();
        cropBoxData = this.getCropBoxData();

        this.render();
        this.setCanvasData($.each(canvasData, function (i, n) {
          canvasData[i] = n * ratio;
        }));
        this.setCropBoxData($.each(cropBoxData, function (i, n) {
          cropBoxData[i] = n * ratio;
        }));
      }
    },

    dblclick: function () {
      if (this.disabled) {
        return;
      }

      if (this.$dragBox.hasClass(CLASS_CROP)) {
        this.setDragMode('move');
      } else {
        this.setDragMode('crop');
      }
    },

    wheel: function (event) {
      var originalEvent = event.originalEvent;
      var e = originalEvent;
      var delta = 1;

      if (this.disabled) {
        return;
      }

      event.preventDefault();

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * 0.1, originalEvent);
    },

    cropStart: function (event) {
      var options = this.options;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = originalEvent || event;
      var touchesLength;
      var cropType;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            e = touches[1];
            this.startX2 = e.pageX;
            this.startY2 = e.pageY;
            cropType = 'zoom';
          } else {
            return;
          }
        }

        e = touches[0];
      }

      cropType = cropType || $(e.target).data('type');

      if (REGEXP_CROP_TYPES.test(cropType)) {
        if (this.trigger(EVENT_CROP_START, {
          originalEvent: originalEvent,
          cropType: cropType
        })) {
          return;
        }

        this.cropType = cropType;
        this.cropping = false;
        this.startX = e.pageX;
        this.startY = e.pageY;

        if (cropType === 'crop') {
          this.cropping = true;
          this.$dragBox.addClass(CLASS_MODAL);
        }
      }
    },

    cropMove: function (event) {
      var options = this.options;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = originalEvent || event;
      var cropType = this.cropType;
      var touchesLength;

      if (this.disabled) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
            e = touches[1];
            this.endX2 = e.pageX;
            this.endY2 = e.pageY;
          } else {
            return;
          }
        }

        e = touches[0];
      }

      if (cropType) {
        if (this.trigger(EVENT_CROP_MOVE, {
          originalEvent: originalEvent,
          cropType: cropType
        })) {
          return;
        }

        this.endX = e.pageX;
        this.endY = e.pageY;

        this.change(e.shiftKey, cropType === 'zoom' ? originalEvent : null);
      }
    },

    cropEnd: function (event) {
      var originalEvent = event.originalEvent;
      var cropType = this.cropType;

      if (this.disabled) {
        return;
      }

      if (cropType) {
        if (this.cropping) {
          this.cropping = false;
          this.$dragBox.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
        }

        this.cropType = '';

        this.trigger(EVENT_CROP_END, {
          originalEvent: originalEvent,
          cropType: cropType
        });
      }
    }
  });
