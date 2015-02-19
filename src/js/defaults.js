  Cropper.DEFAULTS = {
    // Defines the aspect ratio of the crop box
    // Type: Number
    aspectRatio: NaN,

    // Defines the percentage of automatic cropping area when initializes
    // Type: Number (Must large than 0 and less than 1)
    autoCropArea: 0.8, // 80%

    // Outputs the cropping results.
    // Type: Function
    crop: null,

    // Add extra containers for previewing
    // Type: String (jQuery selector)
    preview: '',

    // Toggles
    global: true, // Bind the main events to the document (Only allow one global cropper per page)
    responsive: true, // Rebuild when resize the window
    checkImageOrigin: true, // Check if the target image is cross origin

    modal: true, // Show the black modal
    guides: true, // Show the dashed lines for guiding
    highlight: true, // Show the white modal to highlight the crop box
    background: true, // Show the grid background

    autoCrop: true, // Enable to crop the image automatically when initialize
    dragCrop: true, // Enable to create new crop box by dragging over the image
    movable: true, // Enable to move the crop box
    resizable: true, // Enable to resize the crop box
    rotatable: true, // Enable to rotate the image
    zoomable: true, // Enable to zoom the image
    touchDragZoom: true, // Enable to zoom the image by wheeling mouse
    mouseWheelZoom: true, // Enable to zoom the image by dragging touch

    // Dimensions
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 300,
    minContainerHeight: 150,

    // Events
    build: null, // Function
    built: null, // Function
    dragstart: null, // Function
    dragmove: null, // Function
    dragend: null // Function
  };

  Cropper.setDefaults = function (options) {
    $.extend(Cropper.DEFAULTS, options);
  };
