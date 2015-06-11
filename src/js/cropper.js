  function Cropper(element, options) {
	this.is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
	this.is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
	this.is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
	this.is_safari = navigator.userAgent.indexOf("Safari") > -1;
	this.is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
	  if ((this.is_chrome)&&(this.is_safari)) {this.is_safari=false;}
	  if ((this.is_chrome)&&(this.is_opera)) {this.is_chrome=false;}
	
    this.$element = $(element);
    this.options = $.extend({}, Cropper.DEFAULTS, $.isPlainObject(options) && options);

    this.ready = false;
    this.built = false;
    this.rotated = false;
    this.cropped = false;
    this.disabled = false;
    this.canvas = null;
    this.cropBox = null;

    this.load();
  }
