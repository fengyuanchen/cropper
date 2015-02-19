  $.extend(prototype, {
    resize: function () {
      var $container = this.$container,
          container = this.container;

      if (this.disabled) {
        return;
      }

      if ($container.width() !== container.width || $container.height() !== container.height) {
        clearTimeout(this.resizing);
        this.resizing = setTimeout($.proxy(function () {
          var imageData = this.getImageData(),
              cropBoxData = this.getCropBoxData();

          this.render();
          this.setImageData(imageData);
          this.setCropBoxData(cropBoxData);
        }, this), 200);
      }
    },

    dblclick: function () {
      if (this.disabled) {
        return;
      }

      if (this.$canvas.hasClass(CLASS_CROP)) {
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

      this.zoom(delta * 0.1);
    },

    dragstart: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
          directive,
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
            directive = 'zoom';
          } else {
            return;
          }
        }

        e = touches[0];
      }

      directive = directive || $(e.target).data(STRING_DIRECTIVE);

      if (REGEXP_DIRECTIVES.test(directive)) {
        event.preventDefault();

        dragStartEvent = $.Event(EVENT_DRAG_START);
        this.$element.trigger(dragStartEvent);

        if (dragStartEvent.isDefaultPrevented()) {
          return;
        }

        this.directive = directive;
        this.cropping = false;
        this.startX = e.pageX;
        this.startY = e.pageY;

        if (directive === 'crop') {
          this.cropping = true;
          this.$canvas.addClass(CLASS_MODAL);
        }
      }
    },

    dragmove: function (event) {
      var options = this.options,
          originalEvent = event.originalEvent,
          touches = originalEvent && originalEvent.touches,
          e = event,
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

      if (this.directive) {
        event.preventDefault();

        dragMoveEvent = $.Event(EVENT_DRAG_MOVE);
        this.$element.trigger(dragMoveEvent);

        if (dragMoveEvent.isDefaultPrevented()) {
          return;
        }

        this.endX = e.pageX;
        this.endY = e.pageY;

        this.change();
      }
    },

    dragend: function (event) {
      var dragEndEvent;

      if (this.disabled) {
        return;
      }

      if (this.directive) {
        event.preventDefault();

        dragEndEvent = $.Event(EVENT_DRAG_END);
        this.$element.trigger(dragEndEvent);

        if (dragEndEvent.isDefaultPrevented()) {
          return;
        }

        if (this.cropping) {
          this.cropping = false;
          this.$canvas.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
        }

        this.directive = '';
      }
    }
  });
