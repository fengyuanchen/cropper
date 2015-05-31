  prototype.load = function (url) {
    var options = this.options,
        $this = this.$element,
        crossOrigin,
        bustCacheUrl,
        buildEvent,
        $clone;

    if (!url) {
      if ($this.is('img')) {
        if (!$this.attr('src')) {
          return;
        }

        url = $this.prop('src');
      } else if ($this.is('canvas') && SUPPORT_CANVAS) {
        url = $this[0].toDataURL();
      }
    }

    if (!url) {
      return;
    }

    buildEvent = $.Event(EVENT_BUILD);
    $this.one(EVENT_BUILD, options.build).trigger(buildEvent); // Only trigger once

    if (buildEvent.isDefaultPrevented()) {
      return;
    }

    if (options.checkImageOrigin && isCrossOriginURL(url)) {
      crossOrigin = ' crossOrigin="anonymous"';

      if (!$this.prop('crossOrigin')) { // Only when there was not a "crossOrigin" property
        bustCacheUrl = addTimestamp(url); // Bust cache (#148)
      }
    }

    // IE8 compatibility: Don't use "$().attr()" to set "src"
    this.$clone = $clone = $('<img' + (crossOrigin || '') + ' src="' + (bustCacheUrl || url) + '">');

    $clone.one('load', $.proxy(function () {
      var image = $clone[0],
          naturalWidth = image.naturalWidth || image.width,
          naturalHeight = image.naturalHeight || image.height; // $clone.width() and $clone.height() will return 0 in IE8 (#319)

      this.image = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
        rotate: 0
      };

      this.url = url;
      this.ready = true;
      this.build();
    }, this)).one('error', function () {
      $clone.remove();
    });

    // Hide and insert into the document
    $clone.addClass(CLASS_HIDE).insertAfter($this);
  };
