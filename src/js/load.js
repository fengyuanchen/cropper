  prototype.load = function (url) {
    var options = this.options,
        $this = this.$element,
        crossOrigin,
        buildEvent,
        $clone;

    if (!url) {
      if ($this.is('img')) {
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
      crossOrigin = ' crossOrigin'; // crossOrigin="anonymous"

      if (!$this.prop('crossOrigin')) { // Only when there was not a "crossOrigin" property
        url = addTimestamp(url); // Bust cache (#148)
      }
    }

    this.$clone = $clone = $('<img>');

    $clone.one('load', $.proxy(function () {
      var naturalWidth = $clone.prop('naturalWidth') || $clone.width(),
          naturalHeight = $clone.prop('naturalHeight') || $clone.height();

      this.image = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
        rotate: 0
      };

      this.url = url;
      this.ready = true;
      this.build();
    }, this)).attr({
      src: url,
      crossOrigin: crossOrigin
    });

    // Hide and insert into the document
    $clone.addClass(CLASS_HIDE).insertAfter($this);
  };
