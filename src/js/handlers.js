import $ from 'jquery';
import * as utils from './utilities';

const REGEXP_ACTIONS = /^(e|w|s|n|se|sw|ne|nw|all|crop|move|zoom)$/;

function getPointer({ pageX, pageY }, endOnly) {
  const end = {
    endX: pageX,
    endY: pageY,
  };

  if (endOnly) {
    return end;
  }

  return $.extend({
    startX: pageX,
    startY: pageY,
  }, end);
}

export default {
  resize() {
    const self = this;
    const options = self.options;
    const $container = self.$container;
    const container = self.container;
    const minContainerWidth = Number(options.minContainerWidth) || 200;
    const minContainerHeight = Number(options.minContainerHeight) || 100;

    if (self.disabled || container.width === minContainerWidth ||
      container.height === minContainerHeight) {
      return;
    }

    const ratio = $container.width() / container.width;

    // Resize when width changed or height changed
    if (ratio !== 1 || $container.height() !== container.height) {
      let canvasData;
      let cropBoxData;

      if (options.restore) {
        canvasData = self.getCanvasData();
        cropBoxData = self.getCropBoxData();
      }

      self.render();

      if (options.restore) {
        self.setCanvasData($.each(canvasData, (i, n) => {
          canvasData[i] = n * ratio;
        }));
        self.setCropBoxData($.each(cropBoxData, (i, n) => {
          cropBoxData[i] = n * ratio;
        }));
      }
    }
  },

  dblclick() {
    const self = this;

    if (self.disabled || self.options.dragMode === 'none') {
      return;
    }

    self.setDragMode(self.$dragBox.hasClass('cropper-crop') ? 'move' : 'crop');
  },

  wheel(event) {
    const self = this;
    const e = event.originalEvent || event;
    const ratio = Number(self.options.wheelZoomRatio) || 0.1;

    if (self.disabled) {
      return;
    }

    event.preventDefault();

    // Limit wheel speed to prevent zoom too fast
    if (self.wheeling) {
      return;
    }

    self.wheeling = true;

    setTimeout(() => {
      self.wheeling = false;
    }, 50);

    let delta = 1;

    if (e.deltaY) {
      delta = e.deltaY > 0 ? 1 : -1;
    } else if (e.wheelDelta) {
      delta = -e.wheelDelta / 120;
    } else if (e.detail) {
      delta = e.detail > 0 ? 1 : -1;
    }

    self.zoom(-delta * ratio, event);
  },

  cropStart(e) {
    const self = this;

    if (self.disabled) {
      return;
    }

    const options = self.options;
    const pointers = self.pointers;
    const originalEvent = e.originalEvent;
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

    if (utils.objectKeys(pointers).length > 1 && options.zoomable && options.zoomOnTouch) {
      action = 'zoom';
    } else {
      action = $(e.target).data('action');
    }

    if (!REGEXP_ACTIONS.test(action)) {
      return;
    }

    if (self.trigger('cropstart', {
      originalEvent,
      action,
    }).isDefaultPrevented()) {
      return;
    }

    e.preventDefault();

    self.action = action;
    self.cropping = false;

    if (action === 'crop') {
      self.cropping = true;
      self.$dragBox.addClass('cropper-modal');
    }
  },

  cropMove(e) {
    const self = this;
    const action = self.action;

    if (self.disabled || !action) {
      return;
    }

    const pointers = self.pointers;
    const originalEvent = e.originalEvent;

    e.preventDefault();

    if (self.trigger('cropmove', {
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
        getPointer(originalEvent || e, true)
      );
    }

    self.change(e);
  },

  cropEnd(e) {
    const self = this;

    if (self.disabled) {
      return;
    }

    const action = self.action;
    const pointers = self.pointers;
    const originalEvent = e.originalEvent;

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

    if (!utils.objectKeys(pointers).length) {
      self.action = '';
    }

    if (self.cropping) {
      self.cropping = false;
      self.$dragBox.toggleClass('cropper-modal', self.cropped && self.options.modal);
    }

    self.trigger('cropend', {
      originalEvent,
      action,
    });
  },
};
