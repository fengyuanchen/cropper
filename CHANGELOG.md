# Changelog


## 0.10.1 (Jul 5, 2015)

- Add Pointer Events support (#328)
- Add RTL support (#342)
- Add one new option: "center" (#367)
- Allow cropper to grow vertically (#350)


## 0.10.0 (Jun 8, 2015)

- Add three new options: "change", "cropBoxMovable", "doubleClickToggle"
- Change "movable" option (only for image)
- Rename "resizable" to "cropBoxResizable"
- Add one new event: "change.cropper"
- Locking aspect ratio in "free mode" by holding shift key (#259)
- Sync drag mode to crop box when it is not movable (#300)


## 0.9.3 (May 10, 2015)

- Add one new option: "data"
- Add two new methods: "setData" (#290, #296), "crop" (#275)
- Fix incorrect minWidth/Height size of canvas (#295)
- Fix the strict mode bug (#280)
- Fix the crop box resizing bug (#277)


## 0.9.2 (Apr 18, 2015)

- Improve strict mode to show full image
- Add two new options: "minCanvasWidth" and "minCanvasHeight"
- Reverse mouse wheeling zoom
- Fix incorrect cursor in disabled state


## 0.9.1 (Mar 21, 2015)

- Fix the touch zoom issue (#206)
- Fix the reset issue (#246)


## 0.9.0 (Mar 15, 2015)

- Wraps image with a virtual canvas (for zooming and rotating).
- Limits image position and size in strict mode.
- Supports multiple global croppers by default.
- Outputs cropped canvas for display or get Data URL or get Blob
- Identifies drag events with "event.dragType" property
- Added zoom events for controling the canvas (image) size.
- Improved responsiveness for window resizing.


### Options:

- Change "minContainerWidth" (default value: 300 -> 200)
- Change "minContainerHeight" (default value: 150 -> 100)
- Add "strict"
- Add "zoomin"
- Add "zoomout"
- remove "global"


### Methods:

- Change "replace" (not to change the original image any more)
- Change "getImageData" (move rotation-related properties to canvas data)
- Add "getContainerData"
- Add "getCanvasData"
- Add "setCanvasData"
- Add "getCroppedCanvas"
- Remove "setImageData" (replace with "getCanvasData")
- Remove "getDataURL" (replace with "getCroppedCanvas")


### Events:

- Add "event.dragType" property to drag events
- Add "zoomin.cropper"
- Add "zoomout.cropper"


## 0.8.0 (Feb 19, 2015)

- Refactored source code.
- Compiles CSS with [Less](http://lesscss.org) CSS preprocessors.
- Supports fixed container.
- Supports rotation with CSS3 Transform3d.


### Options:

- Change the default value of "aspectRatio"
- Rename "done" to "crop"
- Rename "dashed" to "guides"
- Rename "multiple" to "global"
- Add "background"
- Add "highlight"
- Add "responsive"
- Add "mouseWheelZoom"
- Add "touchDragZoom"
- Add "minCropBoxWidth"
- Add "minCropBoxHeight"
- Add "minContainerWidth"
- Add "minContainerHeight"
- Remove "data"
- Remove "minWidth"
- Remove "minHeight"
- Remove "maxWidth"
- Remove "maxHeight"


### Methods:

- Change "reset"
- Add "setImageData"
- Add "getCropBoxData"
- Add "setCropBoxData"
- Add "move"
- Remove "setData"


## 0.7.9 (Feb 19, 2015)

- Improve preview.
- Improve rotation.
- Improve responsiveness (#157).
- Enable to move the image when the size of the crop box is the same as the container's (#186).


## 0.7.8 (Feb 8, 2015)

- Add two new options: "minContainerWidth" and "minContainerHeight".
- Improve three methods: "setAspectRatio", "destroy" and "disable".
- Improve mouse wheel zoom.
- Improve drag resizing.


## 0.7.7 (Jan 10, 2015)

- Fix a bug of "dragCrop" option.
- Add a timestamp to the url to bust cache when it's a cross-origin image (#148).
- Fix the issue of "autoCropArea" option (#144).


## 0.7.6 (Dec 20, 2014)

- Fix events binding bugs.
- Change the "done" option and the "getData" method (returns floating-point number) (#130).
- Fix the rotation issue after replace the image (#139).


## 0.7.5 (Nov 27, 2014)

- Reset the ratio when replace the image.
- Add a new option: "checkImageOrigin" (#119).
- Prevent to call the "done" option when it's disabled (#107).
- Improve the preview (#95).


## 0.7.4 (Nov 24, 2014)

- Improve "getDataURL" method, enable to customize the image sizes (#105).
- Fix the issue of destory (#101).
- Fix the issue of canvas (#106).


## 0.7.3 (Nov 15, 2014)

- Supports cross-origin image (#96, #97).
- Add a new option: "autoCropArea".
- Improve "movable" option.
- Output rotation degree by "getImageData" method (#94).


## 0.7.2 (Nov 11, 2014)

- Fix the image rotation error in Firefox (#92).


## 0.7.1 (Nov 8, 2014)

- Rebuild "rotate" method (#88).
- Fix the issue of free ratio (#87).
- Improve "getDataURL" method (#86).
- Optimize event listeners.


## 0.7.0 (Oct 12, 2014)

- Supports zoom (#36, #79).
- Supports rotation (#1, #81).
- Add two new options: "zoomable" and "rotatable".
- Add six new methods: "enable", "disable", "zoom", "rotate", "getDataURL" (#80) and "setDragMode".
- Rename "release" method to "clear".
- Rename "setImgSrc" method to "replace".
- Rename "getImgInfo" method to "getImageData".
- Some other improvements.


## 0.6.2 (Oct 11, 2014)

- Hide the modal when release the crop box.
- Improve touch events.


## 0.6.1 (Oct 3, 2014)

- Fix an event error.


## 0.6.0 (Sep 20, 2014)

- Add six new options: "dashed", "build", "built", "dragstart", "dragmove" and "dragend".
- Add three new events: "dragstart.cropper", "dragmove.cropper" and "dragend.cropper".
- Remove an old event: "render.cropper".
- Supports to toggle the dashed lines by "dashed" option (#68).
- Fix the issue of events (#71).
- Optimize the source code.


## 0.5.5 (Sep 8, 2014)

- Improve the render when the mouse out of the cropper container (#54).


## 0.5.4 (Aug 30, 2014)

- Fix typos: replace "resizeable" with "resizable" and "moveable" with "movable".


## 0.5.3 (Aug 23, 2014)

- Fix the issue (#64) that the crop box could not move after multiple touches.


## 0.5.2 (Aug 16, 2014)

- Fix a bug of type checking in the options.
- Compress the cropper template string.


## 0.5.1 (Aug 12, 2014)

- Supports canvas (#55).


## 0.5.0 (Aug 10, 2014)

- Add a new option: "multiple".


...


## 0.4.0 (Jul 26, 2014)

- Add eight new options: "autoCrop", "dragCrop", "moveable", "resizeable", "maxWidth", "maxHeight", "minWidth" and "minHeight".
- Add three new methods: "reset", "release" and "destroy".
- Add three new events: "build.cropper", "built.cropper" and "render.cropper".
- Remove two old methods: "enbale" and "disable".
- Remove three old events: "dragstart", "dragmove" and "dragend".
- Supports no conflict with the "$.fn.cropper.noConflict" method.


...


## 0.3.0 (May 18, 2014)

- Supports touch.
- Supports events.
- Add three events: "dargstart", "dargmove" and "dargend".
- Add a new method: "setImgSrc".


...


## 0.2.0 (Apr 23, 2014)

- Supports free ratio.
- Add a new option: "data".
- Add four new methods: "getData", "setData", "getImgInfo" and "setAspectRatio".


...


## 0.1.0 (Feb 19, 2014)

- Supports four options: "aspectRatio", "done", "modal" and "preview".
- Supports two methods: "enable" and "disable".
