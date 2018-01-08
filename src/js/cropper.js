import $ from 'jquery';
import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import preview from './preview';
import events from './events';
import handlers from './handlers';
import change from './change';
import methods from './methods';
import {
  ACTION_ALL,
  CLASS_HIDDEN,
  CLASS_HIDE,
  CLASS_INVISIBLE,
  CLASS_MODAL,
  CLASS_MOVE,
  DATA_ACTION,
  EVENT_CROP,
  EVENT_ERROR,
  EVENT_LOAD,
  EVENT_READY,
  NAMESPACE,
  REGEXP_DATA_URL,
  REGEXP_DATA_URL_JPEG,
  REGEXP_TAG_NAME,
} from './constants';
import {
  addTimestamp,
  arrayBufferToDataURL,
  dataURLToArrayBuffer,
  getImageNaturalSizes,
  getOrientation,
  isCrossOriginURL,
  parseOrientation,
} from './utilities';

class Cropper {
  /**
   * Create a new Cropper.
   * @param {Element} element - The target element for cropping.
   * @param {Object} [options={}] - The configuration options.
   */
  constructor(element, options = {}) {
    if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
      throw new Error('The first argument is required and must be an <img> or <canvas> element.');
    }

    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
    this.completed = false;
    this.cropped = false;
    this.disabled = false;
    this.isImg = false;
    this.limited = false;
    this.loaded = false;
    this.ready = false;
    this.replaced = false;
    this.wheeling = false;
    this.originalUrl = '';
    this.canvas = null;
    this.cropBox = null;
    this.pointers = {};
    this.init();
  }

  init() {
    const { $element } = this;
    let url;

    if ($element.is('img')) {
      this.isImg = true;

      // Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
      url = $element.attr('src') || '';
      this.originalUrl = url;

      // Stop when it's a blank image
      if (!url) {
        return;
      }

      // Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
      url = $element.prop('src');
    } else if ($element.is('canvas') && window.HTMLCanvasElement) {
      url = $element[0].toDataURL();
    }

    this.load(url);
  }

  // A shortcut for triggering custom events
  trigger(type, data) {
    const e = $.Event(type, data);

    this.$element.trigger(e);

    return e;
  }

  load(url) {
    if (!url) {
      return;
    }

    this.url = url;
    this.image = {};

    const { $element, options } = this;

    if (!options.checkOrientation || !window.ArrayBuffer) {
      this.clone();
      return;
    }

    // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
    if (REGEXP_DATA_URL.test(url)) {
      if (REGEXP_DATA_URL_JPEG.test(url)) {
        this.read(dataURLToArrayBuffer(url));
      } else {
        this.clone();
      }

      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onerror = () => {
      this.clone();
    };

    xhr.onload = () => {
      this.read(xhr.response);
    };

    if (options.checkCrossOrigin && isCrossOriginURL(url) && $element.prop('crossOrigin')) {
      url = addTimestamp(url);
    }

    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.withCredentials = $element.prop('crossOrigin') === 'use-credentials';
    xhr.send();
  }

  read(arrayBuffer) {
    const { options, image } = this;
    const orientation = getOrientation(arrayBuffer);
    let rotate = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (orientation > 1) {
      this.url = arrayBufferToDataURL(arrayBuffer, 'image/jpeg');
      ({ rotate, scaleX, scaleY } = parseOrientation(orientation));
    }

    if (options.rotatable) {
      image.rotate = rotate;
    }

    if (options.scalable) {
      image.scaleX = scaleX;
      image.scaleY = scaleY;
    }

    this.clone();
  }

  clone() {
    const {
      $element,
      options,
      url,
    } = this;
    let crossOrigin = '';
    let crossOriginUrl;

    if (options.checkCrossOrigin && isCrossOriginURL(url)) {
      crossOrigin = $element.prop('crossOrigin');

      if (crossOrigin) {
        crossOriginUrl = url;
      } else {
        crossOrigin = 'anonymous';

        // Bust cache (#148) when there is not a "crossOrigin" property
        crossOriginUrl = addTimestamp(url);
      }
    }

    this.crossOrigin = crossOrigin;
    this.crossOriginUrl = crossOriginUrl;

    const image = document.createElement('img');

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = crossOriginUrl || url;

    const $clone = $(image);

    this.$clone = $clone;

    if (this.isImg) {
      if (this.element.complete) {
        this.start();
      } else {
        $element.one(EVENT_LOAD, $.proxy(this.start, this));
      }
    } else {
      $clone.one(EVENT_LOAD, $.proxy(this.start, this))
        .one(EVENT_ERROR, $.proxy(this.stop, this))
        .addClass(CLASS_HIDE)
        .insertAfter($element);
    }
  }

  start() {
    const { $clone } = this;
    let $image = this.$element;

    if (!this.isImg) {
      $clone.off(EVENT_ERROR, this.stop);
      $image = $clone;
    }

    getImageNaturalSizes($image[0], (naturalWidth, naturalHeight) => {
      $.extend(this.image, {
        naturalWidth,
        naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
      });

      this.loaded = true;
      this.build();
    });
  }

  stop() {
    this.$clone.remove();
    this.$clone = null;
  }

  build() {
    if (!this.loaded) {
      return;
    }

    // Unbuild first when replace
    if (this.ready) {
      this.unbuild();
    }

    const { $element, options, $clone } = this;
    const $cropper = $(TEMPLATE);
    const $cropBox = $cropper.find(`.${NAMESPACE}-crop-box`);
    const $face = $cropBox.find(`.${NAMESPACE}-face`);

    // Create cropper elements
    this.$container = $element.parent();
    this.$cropper = $cropper;
    this.$canvas = $cropper.find(`.${NAMESPACE}-canvas`).append($clone);
    this.$dragBox = $cropper.find(`.${NAMESPACE}-drag-box`);
    this.$cropBox = $cropBox;
    this.$viewBox = $cropper.find(`.${NAMESPACE}-view-box`);
    this.$face = $face;

    // Hide the original image
    $element.addClass(CLASS_HIDDEN).after($cropper);

    // Show the clone image if is hidden
    if (!this.isImg) {
      $clone.removeClass(CLASS_HIDE);
    }

    this.initPreview();
    this.bind();

    options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
    options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

    this.cropped = options.autoCrop;

    if (options.autoCrop) {
      if (options.modal) {
        this.$dragBox.addClass(CLASS_MODAL);
      }
    } else {
      $cropBox.addClass(CLASS_HIDDEN);
    }

    if (!options.guides) {
      $cropBox.find(`.${NAMESPACE}-dashed`).addClass(CLASS_HIDDEN);
    }

    if (!options.center) {
      $cropBox.find(`.${NAMESPACE}-center`).addClass(CLASS_HIDDEN);
    }

    if (options.cropBoxMovable) {
      $face.addClass(CLASS_MOVE).data(DATA_ACTION, ACTION_ALL);
    }

    if (!options.highlight) {
      $face.addClass(CLASS_INVISIBLE);
    }

    if (options.background) {
      $cropper.addClass(`${NAMESPACE}-bg`);
    }

    if (!options.cropBoxResizable) {
      $cropBox.find(`.${NAMESPACE}-line,.${NAMESPACE}-point`).addClass(CLASS_HIDDEN);
    }

    this.setDragMode(options.dragMode);
    this.render();
    this.ready = true;
    this.setData(options.data);

    // Trigger the ready event asynchronously to keep `data('cropper')` is defined
    this.completing = setTimeout(() => {
      if ($.isFunction(options.ready)) {
        $element.one(EVENT_READY, options.ready);
      }

      this.trigger(EVENT_READY);
      this.trigger(EVENT_CROP, this.getData());
      this.completed = true;
    }, 0);
  }

  unbuild() {
    if (!this.ready) {
      return;
    }

    if (!this.completed) {
      clearTimeout(this.completing);
    }

    this.ready = false;
    this.completed = false;
    this.initialImage = null;

    // Clear `initialCanvas` is necessary when replace
    this.initialCanvas = null;
    this.initialCropBox = null;
    this.container = null;
    this.canvas = null;

    // Clear `cropBox` is necessary when replace
    this.cropBox = null;
    this.unbind();

    this.resetPreview();
    this.$preview = null;

    this.$viewBox = null;
    this.$cropBox = null;
    this.$dragBox = null;
    this.$canvas = null;
    this.$container = null;

    this.$cropper.remove();
    this.$cropper = null;
  }

  /**
   * Change the default options.
   * @param {Object} options - The new default options.
   */
  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

if ($.extend) {
  $.extend(Cropper.prototype, render, preview, events, handlers, change, methods);
}

export default Cropper;
