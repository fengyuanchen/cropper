  prototype.load = function () {
    var _this = this,
        options = this.options,
        $this = this.$element,
        crossOrigin = '',
        buildEvent,
        $clone,
        url;

    if ($this.is('img')) {
      url = $this.prop('src');
    } else if ($this.is('canvas') && support.canvas) {
      url = $this[0].toDataURL();
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

    this.$clone = ($clone = $('<img' + crossOrigin + ' src="' + url + '">'));

    $clone.one('load', function () {
      var naturalWidth = this.naturalWidth || $clone.width(),
          naturalHeight = this.naturalHeight || $clone.height();

      _this.image = {
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
        rotate: 0,
        flip: { horizontally: false, vertically: false }
      };

      _this.url = url;
      _this.ready = true;
      _this.build();
    });

    // Hide and insert into the document
    $clone.addClass(CLASS_HIDE).insertAfter($this);
  };
