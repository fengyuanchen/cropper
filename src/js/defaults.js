  Cropper.DEFAULTS = {

    // Defines the aspect ratio of the crop box
    aspectRatio: NaN,

    // Defines the percentage of automatic cropping area when initializes
    autoCropArea: 0.8,

    // A function for outputting the cropping results
    crop: null,

    // An object with the previous cropping result data
    data: null,

    // A jQuery selector for adding extra containers to preview
    preview: '',

    // Strict mode, the image cannot zoom out less than the container
    strict: true,

    // Rebuild when resize the window
    responsive: true,

    // Check if the target image is cross origin
    checkImageOrigin: true,

    // Show the black modal
    modal: true,

    // Show the dashed lines for guiding
    guides: true,

    // Show the center indicator for guiding
    center: true,

    // Show the white modal to highlight the crop box
    highlight: true,

    // Show the grid background
    background: true,

    // Enable to crop the image automatically when initialize
    autoCrop: true,

    // Enable to create new crop box by dragging over the image
    dragCrop: true,

    // Enable to move the image
    movable: true,

    // Enable to rotate the image
    rotatable: true,

    // Enable to zoom the image
    zoomable: true,

    // Enable to zoom the image by wheeling mouse
    touchDragZoom: true,

    // Enable to zoom the image by dragging touch
    mouseWheelZoom: true,

    // Enable to move the crop box
    cropBoxMovable: true,

    // Enable to resize the crop box
    cropBoxResizable: true,

    // Toggle drag mode between "crop" and "move" when double click on the cropper
    doubleClickToggle: true,

    // Size limitation
    minCanvasWidth: 0,
    minCanvasHeight: 0,
    minCropBoxWidth: 0,
    minCropBoxHeight: 0,
    minContainerWidth: 200,
    minContainerHeight: 100,

    // Shortcuts of events
    build: null,
    built: null,
    cropstart: null,
    cropmove: null,
    cropend: null,
    change: null,
    zoom: null
  };

  Cropper.setDefaults = function (options) {
    $.extend(Cropper.DEFAULTS, options);
  };
