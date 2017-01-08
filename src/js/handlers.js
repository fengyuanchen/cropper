    resize: function () {
      var restore = this.options.restore;
      var $container = this.$container;
      var container = this.container;
      var canvasData;
      var cropBoxData;
      var ratio;

      // Check `container` is necessary for IE8
      if (this.isDisabled || !container) {
        return;
      }

      ratio = $container.width() / container.width;

      // Resize when width changed or height changed
      if (ratio !== 1 || $container.height() !== container.height) {
        if (restore) {
          canvasData = this.getCanvasData();
          cropBoxData = this.getCropBoxData();
        }

        this.render();

        if (restore) {
          this.setCanvasData($.each(canvasData, function (i, n) {
            canvasData[i] = n * ratio;
          }));
          this.setCropBoxData($.each(cropBoxData, function (i, n) {
            cropBoxData[i] = n * ratio;
          }));
        }
      }
    },

    dblclick: function () {
      if (this.isDisabled) {
        return;
      }

      if (this.$dragBox.hasClass(CLASS_CROP)) {
        this.setDragMode(ACTION_MOVE);
      } else {
        this.setDragMode(ACTION_CROP);
      }
    },

    wheel: function (event) {
      var e = event.originalEvent || event;
      var ratio = num(this.options.wheelZoomRatio) || 0.1;
      var delta = 1;

      if (this.isDisabled) {
        return;
      }

      event.preventDefault();

      // Limit wheel speed to prevent zoom too fast
      if (this.wheeling) {
        return;
      }

      this.wheeling = true;

      setTimeout($.proxy(function () {
        this.wheeling = false;
      }, this), 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, event);
    },

    cropStart: function (e) {
      if (this.isDisabled) {
        return;
      }

      var options = this.options;
      var pointers = this.pointers;
      var originalEvent = e.originalEvent;
      var action;

      if (originalEvent && originalEvent.changedTouches) {
        // Handle touch event
        $.each(originalEvent.changedTouches, function (i, touch) {
          pointers[touch.identifier] = getPointer(touch);
        });
      } else {
        // Handle mouse event and pointer event
        pointers[(originalEvent && originalEvent.pointerId) || 0] = getPointer(e);
      }

      if (objectKeys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
        action = 'zoom';
      } else {
        action = $(e.target).data(DATA_ACTION);
      }

      if (REGEXP_ACTIONS.test(action)) {
        if (this.trigger(EVENT_CROP_START, {
          originalEvent: originalEvent,
          action: action
        }).isDefaultPrevented()) {
          return;
        }

        e.preventDefault();

        this.action = action;
        this.cropping = false;

        if (action === ACTION_CROP) {
          this.cropping = true;
          this.$dragBox.addClass(CLASS_MODAL);
        }
      }
    },

    cropMove: function (e) {
      var action = this.action;

      if (this.isDisabled || !action) {
        return;
      }

      var pointers = this.pointers;
      var originalEvent = e.originalEvent;

      e.preventDefault();

      if (this.trigger(EVENT_CROP_MOVE, {
        originalEvent: originalEvent,
        action: action
      }).isDefaultPrevented()) {
        return;
      }

      if (originalEvent && originalEvent.changedTouches) {
        $.each(originalEvent.changedTouches, function (i, touch) {
          $.extend(pointers[touch.identifier], getPointer(touch, true));
        });
      } else {
        $.extend(pointers[(originalEvent && originalEvent.pointerId) || 0], getPointer(e, true));
      }

      this.change(e);
    },

    cropEnd: function (e) {
      var action = this.action;

      if (this.isDisabled || !action) {
        return;
      }

      var pointers = this.pointers;
      var originalEvent = e.originalEvent;

      e.preventDefault();

      if (originalEvent && originalEvent.changedTouches) {
        $.each(originalEvent.changedTouches, function (i, touch) {
          delete pointers[touch.identifier];
        });
      } else {
        delete pointers[(originalEvent && originalEvent.pointerId) || 0];
      }

      if (!objectKeys(pointers).length) {
        this.action = '';
      }

      if (this.cropping) {
        this.cropping = false;
        this.$dragBox.toggleClass(CLASS_MODAL, this.isCropped && this.options.modal);
      }

      this.trigger(EVENT_CROP_END, {
        originalEvent: originalEvent,
        action: action
      });
    },
