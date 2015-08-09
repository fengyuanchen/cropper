  $.extend(prototype, {
    init: function () {
      var $this = this.$element;
      var url;

      if ($this.is('img')) {
        this.isImg = true;

        // Should use `$.fn.attr` here. e.g.: "img/picture.jpg"
        this.originalUrl = url = $this.attr('src');

        // Stop when it's a blank image
        if (!url) {
          return;
        }

        // Should use `$.fn.prop` here. e.g.: "http://example.com/img/picture.jpg"
        url = $this.prop('src');
      } else if ($this.is('canvas') && SUPPORT_CANVAS) {
        url = $this[0].toDataURL();
      }

      this.load(url);
    },

    // A shortcut for triggering custom events
    trigger: function (type, data) {
      var e = $.Event(type, data);

      this.$element.trigger(e);

      return e.isDefaultPrevented();
    },

    load: function (url) {
      var options = this.options;
      var $this = this.$element;
      var crossOrigin = '';
      var bustCacheUrl;
      var $clone;

      if (!url) {
        return;
      }

      // Trigger build event first
      $this.one(EVENT_BUILD, options.build);

      if (this.trigger(EVENT_BUILD)) {
        return;
      }

      if (options.checkImageOrigin && isCrossOriginURL(url)) {
        crossOrigin = ' crossOrigin="anonymous"';

        // Bust cache (#148), only when there was not a "crossOrigin" property
        if (!$this.prop('crossOrigin')) {
          bustCacheUrl = addTimestamp(url);
        }
      }

      // IE8 compatibility: Don't use "$.fn.attr" to set "src"
      this.$clone = $clone = $('<img' + crossOrigin + ' src="' + (bustCacheUrl || url) + '">');

      $clone.one('load', $.proxy(function () {
        var image = $clone[0];

        // Note: $clone.width() and $clone.height() will return 0 in IE8 (#319)
        var naturalWidth = image.naturalWidth || image.width;
        var naturalHeight = image.naturalHeight || image.height;

        this.image = {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: naturalWidth / naturalHeight
        };

        this.url = url;
        this.ready = true;
        this.build();
      }, this)).one('error', function () {
        $clone.remove();
      });

      // Hide the clone image and insert it after the original image
      $clone.addClass(CLASS_HIDE).insertAfter($this);
    }
  });
