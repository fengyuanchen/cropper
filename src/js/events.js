import $ from 'jquery';
import * as utils from './utilities';

// Globals
const PointerEvent = typeof window !== 'undefined' ? window.PointerEvent : null;

// Events
const EVENT_POINTER_DOWN = PointerEvent ? 'pointerdown' : 'touchstart mousedown';
const EVENT_POINTER_MOVE = PointerEvent ? 'pointermove' : 'touchmove mousemove';
const EVENT_POINTER_UP = PointerEvent ? ' pointerup pointercancel' : 'touchend touchcancel mouseup';
const EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
const EVENT_DBLCLICK = 'dblclick';
const EVENT_RESIZE = 'resize';
const EVENT_CROP_START = 'cropstart';
const EVENT_CROP_MOVE = 'cropmove';
const EVENT_CROP_END = 'cropend';
const EVENT_CROP = 'crop';
const EVENT_ZOOM = 'zoom';

export default {
  bind() {
    const self = this;
    const options = self.options;
    const $this = self.$element;
    const $cropper = self.$cropper;

    if ($.isFunction(options.cropstart)) {
      $this.on(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $this.on(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $this.on(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $this.on(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $this.on(EVENT_ZOOM, options.zoom);
    }

    $cropper.on(EVENT_POINTER_DOWN, utils.proxy(self.cropStart, this));

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.on(EVENT_WHEEL, utils.proxy(self.wheel, this));
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.on(EVENT_DBLCLICK, utils.proxy(self.dblclick, this));
    }

    $(document)
      .on(EVENT_POINTER_MOVE, (self.onCropMove = utils.proxy(self.cropMove, this)))
      .on(EVENT_POINTER_UP, (self.onCropEnd = utils.proxy(self.cropEnd, this)));

    if (options.responsive) {
      $(window).on(EVENT_RESIZE, (self.onResize = utils.proxy(self.resize, this)));
    }
  },

  unbind() {
    const self = this;
    const options = self.options;
    const $this = self.$element;
    const $cropper = self.$cropper;

    if ($.isFunction(options.cropstart)) {
      $this.off(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $this.off(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $this.off(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $this.off(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $this.off(EVENT_ZOOM, options.zoom);
    }

    $cropper.off(EVENT_POINTER_DOWN, self.cropStart);

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.off(EVENT_WHEEL, self.wheel);
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.off(EVENT_DBLCLICK, self.dblclick);
    }

    $(document)
      .off(EVENT_POINTER_MOVE, self.onCropMove)
      .off(EVENT_POINTER_UP, self.onCropEnd);

    if (options.responsive) {
      $(window).off(EVENT_RESIZE, self.onResize);
    }
  },
};
