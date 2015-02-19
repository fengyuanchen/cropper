# [Image Cropper](https://github.com/fengyuanchen/cropper)

A simple jQuery image cropping plugin.

- [Documentation](http://fengyuanchen.github.io/cropper)


# Features

- Supports touch
- Supports zoom
- Supports rotation
- Supports canvas
- Supports [options](#options)
- Supports [methods](#methods)
- Supports [events](#events)
- Cross-browser support


# Main

```
dist/
├── cropper.css     ( 5 KB)
├── cropper.min.css ( 4 KB)
├── cropper.js      (47 KB)
└── cropper.min.js  (18 KB)
```


# Getting started

## Quick start

Four quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/cropper/archive/master.zip).
- Clone the repository: `git clone https://github.com/fengyuanchen/cropper.git`.
- Install with [NPM](http://npmjs.org): `npm install cropper`.
- Install with [Bower](http://bower.io): `bower install cropper`.


## Installation

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link  href="/path/to/cropper.css" rel="stylesheet">
<script src="/path/to/cropper.js"></script>
```


## Usage

Initialize with `$.fn.cropper` method.

```html
<!-- Wrap the image or canvas with a block element -->
<div class="container">
  <img src="picture.jpg">
</div>
```

```js
$('.container > img').cropper({
  aspectRatio: 16 / 9,
  crop: function(data) {
    // Output the result data for cropping image.
  }
});
```

**Notes:**

- The size of the cropper inherits from the size of the image's parent element (wrapper), so be sure to wrap the image with a visible block element.

- The values of the result data was computed with the original size of the image, so you can use them to crop the image directly.


## Options

You may set cropper options with `$().cropper(options)`.
If you want to change the global default options, You may use `$.fn.cropper.setDefaults(options)`.


### aspectRatio

- Type: `Number`
- Default: `NaN`

Set the aspect ratio of the crop box. By default, the crop box is free ratio.


### crop

- Type: `Function`
- Default: `null`

This function will be executed when changes the crop box or image.


### preview

- Type: `String` (**jQuery selector**)
- Default: `''`

Add extra elements (containers) for previewing.


### global

- Type: `Boolean`
- Default: `true`

This plugin supports multiple croppers, but only support one global cropper in the same page.
If you intend to use more than one cropper, just initialize them with this option set to `false`.


### background

- Type: `Boolean`
- Default: `true`

Show the grid background of the container.


### modal

- Type: `Boolean`
- Default: `true`

Show the black modal above the crop box.


### guides

- Type: `Boolean`
- Default: `true`

Show the dashed lines above the crop box.


### highlight

- Type: `Boolean`
- Default: `true`

Show the withe modal above the crop box (highlight the crop box).


### autoCrop

- Type: `Boolean`
- Default: `true`

Enable to crop the image automatically when initialize.


### autoCropArea

- Type: `Number`
- Default: `0.8` (80% of the image)

A number between 0 and 1. Define the automatic cropping area size (percentage).


### dragCrop

- Type: `Boolean`
- Default: `true`

Enable to remove the current crop box and create a new one by dragging over the image.


### movable

- Type: `Boolean`
- Default: `true`

Enable to move the crop box.


### resizable

- Type: `Boolean`
- Default: `true`

Enable to resize the crop box.


### zoomable

- Type: `Boolean`
- Default: `true`

Enable to zoom the image.


### mouseWheelZoom

- Type: `Boolean`
- Default: `true`

Enable to zoom the image by wheeling mouse.


### touchDragZoom

- Type: `Boolean`
- Default: `true`

Enable to zoom the image by dragging touch.


### rotatable

- Type: `Boolean`
- Default: `true`

Enable to rotate the image.


### checkImageOrigin

- Type: `Boolean`
- Default: `true`

By default, the plugin will check the image origin, and if it is a cross-origin image, a "crossOrigin" attribute will be added to the image element to enable "getDataURL".


### responsive

- Type: `Boolean`
- Default: `true`

Rebuild the cropper when resize the window.


### minContainerWidth

- Type: `Number`
- Default: `300`

The minimum width of the container.


### minContainerHeight

- Type: `Number`
- Default: `150`

The minimum height of the container.


### minCropBoxWidth

- Type: `Number`
- Default: `0`

The minimum width of the crop box.


### minCropBoxHeight

- Type: `Number`
- Default: `0`

The minimum height of the crop box.


### build

- Type: `Function`
- Default: `null`

A shortcut of the "build.cropper" event.


### built

- Type: `Function`
- Default: `null`

A shortcut of the "built.cropper" event.


### dragstart

- Type: `Function`
- Default: `null`

A shortcut of the "dragstart.cropper" event.


### dragmove

- Type: `Function`
- Default: `null`

A shortcut of the "dragmove.cropper" event.


### dragend

- Type: `Function`
- Default: `null`

A shortcut of the "dragend.cropper" event.


## Methods

General usage:

```js
$().cropper('method', argument1, , argument2, ..., argumentN)
```


### move(offsetX, offsetY)

- **offsetX**:
  - Type: `Number`
  - Moving size (px) in the horizontal direction
- **offsetY**:
  - Type: `Number`
  - Moving size (px) in the vertical direction

Move the image.

```js
$().cropper('move', 1, 0)
$().cropper('move', 0, -1)

```


### zoom(ratio)

- **ratio**:
  - Type: `Number`
  - Zoom in: requires a positive number (ratio > 0)
  - Zoom out: requires a negative number (ratio < 0)

Zoom the image.

```js
$().cropper('zoom', 0.1)
$().cropper('zoom', -0.1)
```


### rotate(degree)

- **degree**:
  - Type: `Number`
  - Rotate right: requires a positive number (degree > 0)
  - Rotate left: requires a negative number (degree < 0)

Rotate the image. Requires CSS3 [Transforms3d](http://caniuse.com/transforms3d) support (IE 10+).

```js
$().cropper('rotate', 90)
$().cropper('rotate', -90)
```


### enable()

Enable (unfreeze) the cropper.


### disable()

Disable (freeze) the cropper.


### reset()

Reset the image and crop box to the initial states.


### clear()

Clear the crop box.


### replace(url)

- **url**:
  - Type: `String`
  - A new image url.

Replace the image and rebuild the cropper.


### destroy()

Destroy the cropper and remove the instance from the image.


### getData([rounded])

- **rounded** (optional):
  - Type: `Boolean`
  - Default: `false`
  - Rounds the output data with `Math.round`.

- (return):
  - Type: `Object`
  - Properties:
    - `x`: the offset left of the cropped area
    - `y`: the offset top of the cropped area
    - `width`: the width of the cropped area
    - `height`: the height of the cropped area
    - `rotate`: the rotated degrees of the image

Get the cropped area data in the original image for cropping image.

![a schematic diagram of data's properties](assets/img/data.png)


### getCropBoxData()

- (return):
  - Type: `Object`
  - Properties:
    - `left`: the offset left of the crop box
    - `top`: the offset top of the crop box
    - `width`: the width of the crop box
    - `height`: the height of the crop box

Output the crop box's position and size data.


### setCropBoxData(data)

- **data**:
  - Type: `Object`
  - Properties:
    - `left`: the new offset left of the crop box
    - `top`: the new offset top of the crop box
    - `width`: the new width of the crop box
    - `height`: the new height of the crop box

Change the crop box's position and size.


### getImageData([all])

- **all**:
  - Type: `Boolean`
  - Default: `false`
  - Get all image data.

- (return):
  - Type: `Object`
  - Properties:
    - `left`: the offset left of the image
    - `top`: the offset top of the image
    - `width`: the width of the image
    - `height`: the height of the image
  - More properties:
    - `naturalWidth`: the natural width of the image
    - `naturalHeight`: the natural height of the image
    - `aspectRatio`: the natural aspect ratio of the image
    - `rotate`: the rotated degrees of the image
    - `rotatedLeft`: the computed offset left of the rotated image
    - `rotatedTop`: the computed offset top of the rotated image
    - `rotatedWidth`: the computed width of the rotated image
    - `rotatedHeight`: the computed height of the rotated image

Output the image's position and size data.


### setImageData(data)

- **data**:
  - Type: `Object`
  - Properties:
    - `left`: the new offset left of the image
    - `top`: the new offset top of the image
    - `width`: the new width of the image
    - `height`: the new height of the image

Change the image's position and size.


### getDataURL([options[, type[, quality]]])

- **options** (optional):
  - Type: `Object`
  - properties
    - `width`: the destination width of the output image
    - `height`: the destination height of the output image

- **type** (optional):
  - Type: `String`
  - Default: `'image/png'`
  - Options:  `'image/jpeg'`, `'image/webp'`.
  - Indicate image format.

- **quality** (optional):
  - Type: `Number`
  - Default: `1`
  - Requires a number between 0 and 1
  - indicate image quality if the requested type is "image/jpeg" or "image/webp".

- (return):
  - Type: `String`
  - A data url of the cropped area.

- Browser support:
  - Basic image: requires [Canvas](http://caniuse.com/canvas) support (IE 9+).
  - Rotated image: requires CSS3 [Transforms3d](http://caniuse.com/transforms3d) support (IE 10+).
  - Cross-origin image: requires HTML5 [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) support (IE 11+).

- Known issues
 - Canvas: `canvas.drawImage` in Some Mac OS / iOS browsers will rotate an image with EXIF Orientation automatically, so the output image get by `canvas.toDataURL` will be incorrect.

Get the data url (base64 image) of the cropped area by Canvas.

```js
$().cropper('getDataURL')

$().cropper('getDataURL', {
  width: 160,
  height: 90
})

$().cropper('getDataURL', 'image/jpeg')

$().cropper('getDataURL', 'image/jpeg', 0.8)

$().cropper('getDataURL', {
  width: 320,
  height: 180
}, 'image/jpeg', 0.8)

```

### setAspectRatio(aspectRatio)

- **aspectRatio**:
  - Type: `Number`
  - Requires a positive number.

Change the aspect ratio of the crop box.


### setDragMode([mode])

- **mode** (optional):
  - Type: `String`
  - Default: `''`
  - Options: `'crop'`, `'move'`

Change the drag mode.

**Tips:** You can toggle the "crop" and "move" mode by double click on the cropper.



## Events

### build.cropper

This event fires when a cropper instance starts to load a image.


### built.cropper

This event fires when a cropper instance has built completely.


### dragstart.cropper

This event fires when the crop box starts to change.

Related original events: "mousedown", "touchstart".


### dragmove.cropper

This event fires when the crop box is changing.

Related original events: "mousemove", "touchmove".


### dragend.cropper

This event fires when the crop box stops to change.

Related original events: "mouseup", "mouseleave", "touchend", "touchleave", "touchcancel".


## No conflict

If you have to use other plugin with the same namespace, just call the `$.fn.cropper.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="cropper.js"></script>
<script>
  $.fn.cropper.noConflict();
  // Code that uses other plugin's "$().cropper" can follow here.
</script>
```


## Browser Support

- Chrome 38+
- Firefox 33+
- Internet Explorer 8+
- Opera 25+
- Safari 5.1+

As a jQuery plugin, you can reference to the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.


## Related projects

- [ngCropper](https://github.com/koorgoo/ngCropper) - AngularJS wrapper for Cropper.
