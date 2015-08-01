  var $window = $(window),
      $document = $(document),
      location = window.location,

      // Constants
      NAMESPACE = 'cropper',
      PREVIEW = 'preview.' + NAMESPACE,

      // RegExps
      REGEXP_DRAG_TYPES = /^(e|n|w|s|ne|nw|sw|se|all|crop|move|zoom)$/,

      // Classes
      CLASS_MODAL = 'cropper-modal',
      CLASS_HIDE = 'cropper-hide',
      CLASS_HIDDEN = 'cropper-hidden',
      CLASS_INVISIBLE = 'cropper-invisible',
      CLASS_MOVE = 'cropper-move',
      CLASS_CROP = 'cropper-crop',
      CLASS_DISABLED = 'cropper-disabled',
      CLASS_BG = 'cropper-bg',

      // Events
      EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown',
      EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove',
      EVENT_MOUSE_UP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel',
      EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll',
      EVENT_DBLCLICK = 'dblclick',
      EVENT_RESIZE = 'resize.' + NAMESPACE, // Bind to window with namespace
      EVENT_BUILD = 'build.' + NAMESPACE,
      EVENT_BUILT = 'built.' + NAMESPACE,
      EVENT_DRAG_START = 'dragstart.' + NAMESPACE,
      EVENT_DRAG_END = 'dragend.' + NAMESPACE,
      EVENT_DRAG_MOVE = 'dragmove.' + NAMESPACE,
      EVENT_ZOOM_IN = 'zoomin.' + NAMESPACE,
      EVENT_ZOOM_OUT = 'zoomout.' + NAMESPACE,
      EVENT_CHANGE = 'change.' + NAMESPACE,

      // Supports
      SUPPORT_CANVAS = $.isFunction($('<canvas>')[0].getContext),

      // Others
      sqrt = Math.sqrt,
      min = Math.min,
      max = Math.max,
      abs = Math.abs,
      sin = Math.sin,
      cos = Math.cos,
      num = parseFloat,

      // Prototype
      prototype = {};
