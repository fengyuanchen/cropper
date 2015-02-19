# [Image Cropper](https://github.com/fengyuanchen/cropper)

A simple jQuery image cropping plugin.

- [Documentation](http://fengyuanchen.github.io/cropper)
- [Demo](http://fengyuanchen.github.io/cropper#overview)


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
├── cropper.js      (44 KB)
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

```javascript
$(".container > img").cropper({
  aspectRatio: 16 / 9,
  done: function(data) {
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


#### aspectRatio

- type: `String` | `Number`
- default: `"auto"`

The aspect ratio of the cropping zone.
By default, the cropping zone is free ratio.


#### data

- type: `Object`
- options: "x", "y", "width", "height"
- default: `{}`

By default, the cropping zone will appear in the center of the image.
If you already have values of the last crop and you want to apply them, just set them as option.

For example:

```javascript
{
  x: 100,
  y: 50,
  width: 480,
  height: 270
}
```

#### done

- type: `Function`
- default: `function(data) {}`

This function will be executed when the cropping zone changes by a move, resize or crop.


#### preview

- type: selector
- default: `""`

A jquery selector, add extra elements for a preview.


#### multiple

- type: `Boolean`
- default: `false`

By default, the plugin only supports one cropper per page. If you intend to use more than one, just initialize them with this option set to `true`.


#### modal

- type: `Boolean`
- default: `true`

Show (true) or hide (false) the black modal layer above the cropper.


#### dashed

- type: `Boolean`
- default: `true`

Show (true) or hide (false) the dashed lines above the cropping zone.


#### autoCrop

- type: `Boolean`
- default: `true`

Render the cropping zone automatically when initialize.


#### autoCropArea

- type: `Number`
- default: `0.8`

A number between 0 and 1. Define the automatic cropping area size (percentage).


#### dragCrop

- type: `Boolean`
- default: `true`

Enable to remove the current cropping zone and create a new one by dragging over the image.


#### movable

- type: `Boolean`
- default: `true`

Enable to move the cropping zone.


#### resizable

- type: `Boolean`
- default: `true`

Enable to resize the cropping zone.


#### zoomable

- type: `Boolean`
- default: `true`

Enable to zoom the image.


#### rotatable

- type: `Boolean`
- default: `true`

Enable to rotate the image.


#### checkImageOrigin

- type: `Boolean`
- default: `true`

By default, the plugin will check the image origin, and if it is a cross-origin image, a "crossOrigin" attribute will be added to the image element to enable "rotate" and "getDataURL".


#### minWidth

- type: `Number`
- default: `0`

The minimum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum width.


#### minHeight

- type: `Number`
- default: `0`

The minimum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum height.


#### maxWidth

- type: `Number`
- default: `Infinity`

The maximum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum width.


#### maxHeight

- type: `Number`
- default: `Infinity`

The maximum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum height.


#### minContainerWidth

- type: `Number`
- default: 300

The minimum width of the cropper container.


#### minContainerHeight

- type: `Number`
- default: 150

The minimum height of the cropper container.


#### build

- type: `Function`
- default: `null`

An event handler of the "build.cropper" event.


#### built

- type: `Function`
- default: `null`

An event handler of the "built.cropper" event.


#### dragstart

- type: `Function`
- default: `null`

An event handler of the "dragstart.cropper" event.


#### dragmove

- type: `Function`
- default: `null`

An event handler of the "dragmove.cropper" event.


#### dragend

- type: `Function`
- default: `null`

An event handler of the "dragend.cropper" event.


## Methods

As there is a asynchronous process while the cropper build, you must call the following methods only when the cropper built completely.

For example:

```js
$("img").cropper({
  built: function () {
    $(this).cropper("getData");
  }
});
```

Or

```js
$("img").on("built.cropper", function () {
  $(this).cropper("getDataURL");
}).cropper();
```

#### zoom

- Zoom the image.
- Param: a number (positive number for zoom in, negative number for zoom out).
- Usage: `$().cropper("zoom", 0.1)` or `$().cropper("zoom", -0.1)`.


#### rotate

- Rotate the image (Replace the original image with a new rotated image which was generated by canvas).
- Param: a number (positive number for rotate right, negative number for rotate left).
- Usage: `$().cropper("rotate", 90)` or `$().cropper("rotate", -90)`.
- **Note**: Be sure the browser supports canvas before call this method.
- **Note**: Don't call this in IE9/10 (not support `crossOrigin` attribute) when it's a cross-origin image.

#### enable

- Enable (unfreeze) the cropper.
- Usage: `$().cropper("enable")`.


#### disable

- Disable (freeze) the cropper.
- Usage: `$().cropper("disable")`.


#### reset

- Reset the cropping zone to the start state.
- Add a `true` param to reset the cropping zone to the default state.
- Usage: `$().cropper("reset")` or `$().cropper("reset", true)`.


#### clear

- Clear the cropping zone.
- Usage: `$().cropper("clear")`.


#### replace

- Replace the image.
- Param: a url.
- Usage: `$().cropper("replace", "example.jpg")`.


#### destroy

- Destroy the cropper and remove the instance from the image.
- Usage: `$().cropper("destroy")`.


#### getData([rounded])

- Get the cropped zone data.
- `rounded`(optional):
  - Type: `Boolean`
  - Default: `false`
  - Rounds the output data with `Math.round`.
- Usage: `$().cropper("getData")` or `$().cropper("getData", true)`.


#### setData

- Reset the cropped zone with new data.
- Param: an object containing: "x", "y", "width", "height".
- Use with `$().cropper("setData", {width: 480, height: 270})`.

**Tip:** If you want to remove the current data, just pass an empty object or `null`. For example: `$().cropper("setData", {})` or `$().cropper("setData", null)`.


#### setAspectRatio

- Enable to reset the aspect ratio after built.
- Param: "auto" or a positive number ("auto" for free ratio).
- Usage: `$().cropper("setAspectRatio", 1.618)`.


#### getImageData

- Get an object containing image data, contains: "naturalWidth", "naturalHeight", "width", "height", "aspectRatio", "ratio" and "rotate".
- The "aspectRatio" is the value of "naturalWidth / naturalHeight".
- The "ratio" is the value of "width / naturalWidth".
- The "rotate" is the rotated degree of the current image.
- Usage: `$().cropper("getImageData")`.


#### setDragMode

- Change the drag mode.
- Params: "crop", "move" and "none".
- Usage: `$().cropper("setDragMode", "crop")`.

**Tip**: You can toggle the "crop" and "move" mode by double click on the image.


#### getDataURL([options[, type[, quality]]])

- Get the data url (base64 image) of the cropped zone.
- Parameters:
  + options: An `Object` contains: "width", "height". Define the sizes of the result image.
  + type: A `String` indicating the image format. The default type is image/png. Other types: "image/jpeg", "image/webp".
  + quality: A `Number` between 0 and 1 indicating image quality if the requested type is image/jpeg or image/webp.
- **Note:** Be sure the browser supports canvas before calling this method.
- **Note:** Don't call this on IE9/10 (no support for [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes)) when it's a [cross-origin image](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img).
- Usage:

```js
$().cropper("getDataURL")

$().cropper("getDataURL", {
  width: 100,
  height: 100
})

$().cropper("getDataURL", "image/jpeg")

$().cropper("getDataURL", "image/jpeg", 0.8)

$().cropper("getDataURL", {
  width: 100,
  height: 100
}, "image/jpeg", 0.8)

```


## Events


#### build.cropper

This event will be fired when the Cropper starts to build.


#### built.cropper

This event will be fired when the Cropper has been built.


#### dragstart.cropper

This event will be fired before the cropping zone start to move.

Related events: "mousedown", "touchstart".


#### dragmove.cropper

This event will be fired when the cropping zone was moving.

Related events: "mousemove", "touchmove".


#### dragend.cropper

This event will be fired after the cropping zone stop to move.

Related events: "mouseup", "mouseleave", "touchend", "touchleave", "touchcancel".


## No conflict

If you have to use other plugin with the same namespace, just call the `$.fn.cropper.noConflict` method to revert to it.

```
<script src="other-plugin.js"></script>
<script src="cropper.js"></script>
<script>
  $.fn.cropper.noConflict();
  // Code that uses other plugin's "$().cropper" can follow here.
</script>
```


## Browser Support

- Chrome 36+
- Firefox 31+
- Internet Explorer 8+
- Opera 21+
- Safari 5.1+

As a jQuery plugin, you can reference to the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.


## Related projects

- [ngCropper](https://github.com/koorgoo/ngCropper) - AngularJS wrapper for Cropper.
