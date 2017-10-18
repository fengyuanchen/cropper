import $ from 'jquery';
import {
  EVENT_CROP,
  EVENT_CROP_END,
  EVENT_CROP_MOVE,
  EVENT_CROP_START,
  EVENT_DBLCLICK,
  EVENT_POINTER_DOWN,
  EVENT_POINTER_MOVE,
  EVENT_POINTER_UP,
  EVENT_RESIZE,
  EVENT_WHEEL,
  EVENT_ZOOM,
} from './constants';
import {
  proxy,
} from './utilities';

export default {
  bind() {
    const { $element, options, $cropper } = this;

    if ($.isFunction(options.cropstart)) {
      $element.on(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $element.on(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $element.on(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $element.on(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $element.on(EVENT_ZOOM, options.zoom);
    }

    $cropper.on(EVENT_POINTER_DOWN, proxy(this.cropStart, this));

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.on(EVENT_WHEEL, proxy(this.wheel, this));
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.on(EVENT_DBLCLICK, proxy(this.dblclick, this));
    }

    $(document)
      .on(EVENT_POINTER_MOVE, (this.onCropMove = proxy(this.cropMove, this)))
      .on(EVENT_POINTER_UP, (this.onCropEnd = proxy(this.cropEnd, this)));

    if (options.responsive) {
      $(window).on(EVENT_RESIZE, (this.onResize = proxy(this.resize, this)));
    }
  },

  unbind() {
    const { $element, options, $cropper } = this;

    if ($.isFunction(options.cropstart)) {
      $element.off(EVENT_CROP_START, options.cropstart);
    }

    if ($.isFunction(options.cropmove)) {
      $element.off(EVENT_CROP_MOVE, options.cropmove);
    }

    if ($.isFunction(options.cropend)) {
      $element.off(EVENT_CROP_END, options.cropend);
    }

    if ($.isFunction(options.crop)) {
      $element.off(EVENT_CROP, options.crop);
    }

    if ($.isFunction(options.zoom)) {
      $element.off(EVENT_ZOOM, options.zoom);
    }

    $cropper.off(EVENT_POINTER_DOWN, this.cropStart);

    if (options.zoomable && options.zoomOnWheel) {
      $cropper.off(EVENT_WHEEL, this.wheel);
    }

    if (options.toggleDragModeOnDblclick) {
      $cropper.off(EVENT_DBLCLICK, this.dblclick);
    }

    $(document)
      .off(EVENT_POINTER_MOVE, this.onCropMove)
      .off(EVENT_POINTER_UP, this.onCropEnd);

    if (options.responsive) {
      $(window).off(EVENT_RESIZE, this.onResize);
    }
  },
};
