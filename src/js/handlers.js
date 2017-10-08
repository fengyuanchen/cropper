import $ from 'jquery';
import {
  ACTION_CROP,
  ACTION_ZOOM,
  CLASS_CROP,
  CLASS_MODAL,
  DATA_ACTION,
  DRAG_MODE_CROP,
  DRAG_MODE_MOVE,
  DRAG_MODE_NONE,
  EVENT_CROP_END,
  EVENT_CROP_MOVE,
  EVENT_CROP_START,
  REGEXP_ACTIONS,
} from './constants';
import {
  getPointer,
  objectKeys,
} from './utilities';

export default {
  resize() {
    const { options, $container, container } = this;
    const minContainerWidth = Number(options.minContainerWidth) || 200;
    const minContainerHeight = Number(options.minContainerHeight) || 100;

    if (this.disabled || container.width <= minContainerWidth ||
      container.height <= minContainerHeight) {
      return;
    }

    const ratio = $container.width() / container.width;

    // Resize when width changed or height changed
    if (ratio !== 1 || $container.height() !== container.height) {
      let canvasData;
      let cropBoxData;

      if (options.restore) {
        canvasData = this.getCanvasData();
        cropBoxData = this.getCropBoxData();
      }

      this.render();

      if (options.restore) {
        this.setCanvasData($.each(canvasData, (i, n) => {
          canvasData[i] = n * ratio;
        }));
        this.setCropBoxData($.each(cropBoxData, (i, n) => {
          cropBoxData[i] = n * ratio;
        }));
      }
    }
  },

  dblclick() {
    if (this.disabled || this.options.dragMode === DRAG_MODE_NONE) {
      return;
    }

    this.setDragMode(this.$dragBox.hasClass(CLASS_CROP) ? DRAG_MODE_MOVE : DRAG_MODE_CROP);
  },

  wheel(event) {
    const e = event.originalEvent || event;
    const ratio = Number(this.options.wheelZoomRatio) || 0.1;

    if (this.disabled) {
      return;
    }

    event.preventDefault();

    // Limit wheel speed to prevent zoom too fast
    if (this.wheeling) {
      return;
    }

    this.wheeling = true;

    setTimeout(() => {
      this.wheeling = false;
    }, 50);

    let delta = 1;

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    this.zoom(-delta * ratio, event);
  },

  cropStart(e) {
    if (this.disabled) {
      return;
    }

    const { options, pointers } = this;
    const { originalEvent } = e;
    let action;

    if (originalEvent && originalEvent.changedTouches) {
      // Handle touch event
      $.each(originalEvent.changedTouches, (i, touch) => {
        pointers[touch.identifier] = getPointer(touch);
      });
    } else {
      // Handle mouse event and pointer event
      pointers[(originalEvent && originalEvent.pointerId) || 0] = getPointer(originalEvent || e);
    }

    if (objectKeys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
      action = ACTION_ZOOM;
    } else {
      action = $(e.target).data(DATA_ACTION);
    }

    if (!REGEXP_ACTIONS.test(action)) {
      return;
    }

    if (this.trigger(EVENT_CROP_START, {
      originalEvent,
      action,
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
  },

  cropMove(e) {
    const { action } = this;

    if (this.disabled || !action) {
      return;
    }

    const { pointers } = this;
    const { originalEvent } = e;

    e.preventDefault();

    if (this.trigger(EVENT_CROP_MOVE, {
      originalEvent,
      action,
    }).isDefaultPrevented()) {
      return;
    }

    if (originalEvent && originalEvent.changedTouches) {
      $.each(originalEvent.changedTouches, (i, touch) => {
        $.extend(pointers[touch.identifier], getPointer(touch, true));
      });
    } else {
      $.extend(
        pointers[(originalEvent && originalEvent.pointerId) || 0],
        getPointer(originalEvent || e, true),
      );
    }

    this.change(e);
  },

  cropEnd(e) {
    if (this.disabled) {
      return;
    }

    const { action } = this;
    const { pointers } = this;
    const { originalEvent } = e;

    if (originalEvent && originalEvent.changedTouches) {
      $.each(originalEvent.changedTouches, (i, touch) => {
        delete pointers[touch.identifier];
      });
    } else {
      delete pointers[(originalEvent && originalEvent.pointerId) || 0];
    }

    if (!action) {
      return;
    }

    e.preventDefault();

    if (!objectKeys(pointers).length) {
      this.action = '';
    }

    if (this.cropping) {
      this.cropping = false;
      this.$dragBox.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
    }

    this.trigger(EVENT_CROP_END, {
      originalEvent,
      action,
    });
  },
};
