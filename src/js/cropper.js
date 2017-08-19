import $ from 'jquery';
import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import preview from './preview';
import events from './events';
import handlers from './handlers';
import change from './change';
import methods from './methods';
import * as utils from './utilities';

const CLASS_HIDDEN = 'cropper-hidden';
const REGEXP_DATA_URL = /^data:/;
const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;

class Cropper {
  constructor(element, options) {
    const self = this;

    self.$element = $(element);
    self.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
    self.loaded = false;
    self.ready = false;
    self.completed = false;
    self.rotated = false;
    self.cropped = false;
    self.disabled = false;
    self.replaced = false;
    self.limited = false;
    self.wheeling = false;
    self.isImg = false;
    self.originalUrl = '';
    self.canvas = null;
    self.cropBox = null;
    self.pointers = {};
    self.init();
  }

  init() {
    const self = this;
    const $this = self.$element;
    let url;

    if ($this.is('img')) {
      self.isImg = true;

      // Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
      url = $this.attr('src');
      self.originalUrl = url;

      // Stop when it's a blank image
      if (!url) {
        return;
      }

      // Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
      url = $this.prop('src');
    } else if ($this.is('canvas') && window.HTMLCanvasElement) {
      url = $this[0].toDataURL();
    }

    self.load(url);
  }

  // A shortcut for triggering custom events
  trigger(type, data) {
    const e = $.Event(type, data);

    this.$element.trigger(e);

    return e;
  }

  load(url) {
    const self = this;
    const options = self.options;
    const $this = self.$element;

    if (!url) {
      return;
    }

    self.url = url;
    self.image = {};

    if (!options.checkOrientation || !window.ArrayBuffer) {
      self.clone();
      return;
    }

    // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
    if (REGEXP_DATA_URL.test(url)) {
      if (REGEXP_DATA_URL_JPEG.test(url)) {
        self.read(utils.dataURLToArrayBuffer(url));
      } else {
        self.clone();
      }
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onerror = $.proxy(() => {
      self.clone();
    }, this);

    xhr.onload = function load() {
      self.read(this.response);
    };

    if (options.checkCrossOrigin && utils.isCrossOriginURL(url) && $this.prop('crossOrigin')) {
      url = utils.addTimestamp(url);
    }

    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.withCredentials = $this.prop('crossOrigin') === 'use-credentials';
    xhr.send();
  }

  read(arrayBuffer) {
    const self = this;
    const options = self.options;
    const orientation = utils.getOrientation(arrayBuffer);
    const image = self.image;
    let rotate = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (orientation > 1) {
      self.url = utils.arrayBufferToDataURL(arrayBuffer);

      switch (orientation) {
        // flip horizontal
        case 2:
          scaleX = -1;
          break;

        // rotate left 180°
        case 3:
          rotate = -180;
          break;

        // flip vertical
        case 4:
          scaleY = -1;
          break;

        // flip vertical + rotate right 90°
        case 5:
          rotate = 90;
          scaleY = -1;
          break;

        // rotate right 90°
        case 6:
          rotate = 90;
          break;

        // flip horizontal + rotate right 90°
        case 7:
          rotate = 90;
          scaleX = -1;
          break;

        // rotate left 90°
        case 8:
          rotate = -90;
          break;

        default:
      }
    }

    if (options.rotatable) {
      image.rotate = rotate;
    }

    if (options.scalable) {
      image.scaleX = scaleX;
      image.scaleY = scaleY;
    }

    self.clone();
  }

  clone() {
    const self = this;
    const options = self.options;
    const $this = self.$element;
    const url = self.url;
    let crossOrigin = '';
    let crossOriginUrl;

    if (options.checkCrossOrigin && utils.isCrossOriginURL(url)) {
      crossOrigin = $this.prop('crossOrigin');

      if (crossOrigin) {
        crossOriginUrl = url;
      } else {
        crossOrigin = 'anonymous';

        // Bust cache (#148) when there is not a "crossOrigin" property
        crossOriginUrl = utils.addTimestamp(url);
      }
    }

    self.crossOrigin = crossOrigin;
    self.crossOriginUrl = crossOriginUrl;

    const image = document.createElement('img');

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = crossOriginUrl || url;

    const $clone = $(image);

    self.$clone = $clone;

    if (self.isImg) {
      if ($this[0].complete) {
        self.start();
      } else {
        $this.one('load', $.proxy(self.start, this));
      }
    } else {
      $clone.one('load', $.proxy(self.start, this))
        .one('error', $.proxy(self.stop, this))
        .addClass('cropper-hide')
        .insertAfter($this);
    }
  }

  start() {
    const self = this;
    const $clone = self.$clone;
    let $image = self.$element;

    if (!self.isImg) {
      $clone.off('error', self.stop);
      $image = $clone;
    }

    utils.getImageSize($image[0], (naturalWidth, naturalHeight) => {
      $.extend(self.image, {
        naturalWidth,
        naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
      });

      self.loaded = true;
      self.build();
    });
  }

  stop() {
    const self = this;

    self.$clone.remove();
    self.$clone = null;
  }

  build() {
    const self = this;
    const options = self.options;
    const $this = self.$element;
    const $clone = self.$clone;

    if (!self.loaded) {
      return;
    }

    // Unbuild first when replace
    if (self.ready) {
      self.unbuild();
    }

    const $cropper = $(TEMPLATE);
    const $cropBox = $cropper.find('.cropper-crop-box');
    const $face = $cropBox.find('.cropper-face');

    // Create cropper elements
    self.$container = $this.parent();
    self.$cropper = $cropper;
    self.$canvas = $cropper.find('.cropper-canvas').append($clone);
    self.$dragBox = $cropper.find('.cropper-drag-box');
    self.$cropBox = $cropBox;
    self.$viewBox = $cropper.find('.cropper-view-box');
    self.$face = $face;

    // Hide the original image
    $this.addClass(CLASS_HIDDEN).after($cropper);

    // Show the clone image if is hidden
    if (!self.isImg) {
      $clone.removeClass('cropper-hide');
    }

    self.initPreview();
    self.bind();

    options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
    options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

    self.cropped = options.autoCrop;

    if (options.autoCrop) {
      if (options.modal) {
        self.$dragBox.addClass('cropper-modal');
      }
    } else {
      $cropBox.addClass(CLASS_HIDDEN);
    }

    if (!options.guides) {
      $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
    }

    if (!options.center) {
      $cropBox.find('.cropper-center').addClass(CLASS_HIDDEN);
    }

    if (options.cropBoxMovable) {
      $face.addClass('cropper-move').data('action', 'all');
    }

    if (!options.highlight) {
      $face.addClass('cropper-invisible');
    }

    if (options.background) {
      $cropper.addClass('cropper-bg');
    }

    if (!options.cropBoxResizable) {
      $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
    }

    self.setDragMode(options.dragMode);
    self.render();
    self.ready = true;
    self.setData(options.data);

    // Trigger the ready event asynchronously to keep `data('cropper')` is defined
    self.completing = setTimeout(() => {
      if ($.isFunction(options.ready)) {
        $this.one('ready', options.ready);
      }

      self.trigger('ready');
      self.trigger('crop', self.getData());
      self.completed = true;
    }, 0);
  }

  unbuild() {
    const self = this;

    if (!self.ready) {
      return;
    }

    if (!self.completed) {
      clearTimeout(self.completing);
    }

    self.ready = false;
    self.completed = false;
    self.initialImage = null;

    // Clear `initialCanvas` is necessary when replace
    self.initialCanvas = null;
    self.initialCropBox = null;
    self.container = null;
    self.canvas = null;

    // Clear `cropBox` is necessary when replace
    self.cropBox = null;
    self.unbind();

    self.resetPreview();
    self.$preview = null;

    self.$viewBox = null;
    self.$cropBox = null;
    self.$dragBox = null;
    self.$canvas = null;
    self.$container = null;

    self.$cropper.remove();
    self.$cropper = null;
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

$.extend(Cropper.prototype, render);
$.extend(Cropper.prototype, preview);
$.extend(Cropper.prototype, events);
$.extend(Cropper.prototype, handlers);
$.extend(Cropper.prototype, change);
$.extend(Cropper.prototype, methods);

export default Cropper;
