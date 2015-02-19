  var $window = $(window),
      $document = $(document),
      location = window.location,

      // Constants
      STRING_DIRECTIVE = 'directive',
      CROPPER_NAMESPACE = '.cropper',

      // RegExps
      REGEXP_DIRECTIVES = /^(e|n|w|s|ne|nw|sw|se|all|crop|move|zoom)$/,
      // REGEXP_OPTIONS = /^(x|y|width|height|rotate)$/,
      // REGEXP_PROPERTIES = /^(naturalWidth|naturalHeight|width|height|aspectRatio|ratio|rotate)$/,

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
      EVENT_MOUSE_DOWN = 'mousedown touchstart',
      EVENT_MOUSE_MOVE = 'mousemove touchmove',
      EVENT_MOUSE_UP = 'mouseup mouseleave touchend touchleave touchcancel',
      EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll',
      EVENT_DBLCLICK = 'dblclick',
      EVENT_RESIZE = 'resize' + CROPPER_NAMESPACE, // Bind to window with namespace
      EVENT_BUILD = 'build' + CROPPER_NAMESPACE,
      EVENT_BUILT = 'built' + CROPPER_NAMESPACE,
      EVENT_DRAG_START = 'dragstart' + CROPPER_NAMESPACE,
      EVENT_DRAG_MOVE = 'dragmove' + CROPPER_NAMESPACE,
      EVENT_DRAG_END = 'dragend' + CROPPER_NAMESPACE,

      // Supports
      support = {
        canvas: $.isFunction($('<canvas>')[0].getContext)
      },

      // Others
      round = Math.round,
      sqrt = Math.sqrt,
      min = Math.min,
      max = Math.max,
      abs = Math.abs,
      sin = Math.sin,
      cos = Math.cos,
      num = parseFloat,

      // Prototype
      prototype = {};
