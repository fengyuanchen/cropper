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

      this.url = url;

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

      this.$clone = $clone = $('<img' + crossOrigin + ' src="' + (bustCacheUrl || url) + '">');

      if (this.isImg) {
        if ($this[0].complete) {
          this.start();
        } else {
          $this.one(EVENT_LOAD, $.proxy(this.start, this));
        }
      } else {
        $clone.
          one(EVENT_LOAD, $.proxy(this.start, this)).
          one(EVENT_ERROR, $.proxy(this.stop, this)).
          addClass(CLASS_HIDE).
          insertAfter($this);
      }
    },

    start: function () {
      this.image = getImageData(this.isImg ? this.$element[0] : this.$clone[0]);
      this.ready = true;
      this.build();
    },

    stop: function () {
      this.$clone.remove();
      this.$clone = null;
    }
  });
