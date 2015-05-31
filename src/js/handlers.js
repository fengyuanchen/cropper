  $.extend(prototype, {
    resize: function () {
      var $container = this.$container,
          container = this.container,
          canvasData,
          cropBoxData,
          ratio;

      if (this.disabled || !container) { // Check "container" for IE8
        return;
      }

      ratio = $container.width() / container.width;

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
      var e = event.originalEvent,
          delta = 1;

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

      this.zoom(-delta * 0.1);
    },

    dragstart: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
          dragType,
          dragStartEvent,
          touchesLength;

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
            dragType = 'zoom';
          } else {
            return;
          }
        }

        e = touches[0];
      }

      dragType = dragType || $(e.target).data('drag');

      if (REGEXP_DRAG_TYPES.test(dragType)) {
        event.preventDefault();

        dragStartEvent = $.Event(EVENT_DRAG_START, {
          originalEvent: originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragStartEvent);

        if (dragStartEvent.isDefaultPrevented()) {
          return;
        }

        this.dragType = dragType;
        this.cropping = false;
        this.startX = e.pageX;
        this.startY = e.pageY;

        if (dragType === 'crop') {
          this.cropping = true;
          this.$dragBox.addClass(CLASS_MODAL);
        }
      }
    },

    dragmove: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
          dragType = this.dragType,
          dragMoveEvent,
          touchesLength;

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

      if (dragType) {
        event.preventDefault();

        dragMoveEvent = $.Event(EVENT_DRAG_MOVE, {
          originalEvent: originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragMoveEvent);

        if (dragMoveEvent.isDefaultPrevented()) {
          return;
        }

        this.endX = e.pageX;
        this.endY = e.pageY;

        this.change(e.shiftKey);
      }
    },

    dragend: function (event) {
      var dragType = this.dragType,
          dragEndEvent;

      if (this.disabled) {
        return;
      }

      if (dragType) {
        event.preventDefault();

        dragEndEvent = $.Event(EVENT_DRAG_END, {
          originalEvent: event.originalEvent,
          dragType: dragType
        });

        this.$element.trigger(dragEndEvent);

        if (dragEndEvent.isDefaultPrevented()) {
          return;
        }

        if (this.cropping) {
          this.cropping = false;
          this.$dragBox.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
        }

        this.dragType = '';
      }
    }
  });
