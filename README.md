# [Image Cropper](http://fengyuanchen.github.io/cropper)

A simple jQuery image cropping plugin.

- [Documentation](http://fengyuanchen.github.io/cropper)
- [Demo](http://fengyuanchen.github.io/cropper#overview)


# Features

- Supports touch
- Supports [options](#options)
- Supports [methods](#methods)
- Supports [events](#events)
- Supports canvas
- Cross-browser support


# Main

```
dist/
├── cropper.css     ( 4 KB)
├── cropper.min.css ( 4 KB)
├── cropper.js      (29 KB)
└── cropper.min.js  (12 KB)
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
<!-- Be sure to wrap the img with a block element -->
<div>
  <img class="cropper" src="picture.jpg">
</div>
```

```javascript
$(".cropper").cropper({
  aspectRatio: 16 / 9,
  done: function(data) {
    // Crop image with the data.
  }
});
```

**Notes:**
- Please use the cropper on visible images only. In other words, don't try to use the cropper on an image which is wrapped by a hidden element.
- The size of the cropper is based on the size of the wrapper of target image, so be sure to wrap the image with a block element.
- The cropper will be re-rendered automatically on the resize of window.
- The result data is based on the original image.


## Options

You may set cropper options with `$().cropper(options)`.
If you want to change the global default options, You may use `$.fn.cropper.setDefaults(options)`.


#### aspectRatio

- type: string / number
- default: "auto"

The aspect ratio of the cropping zone (e.g., "2", "1.3", "0.5", etc.).
Just set it with "auto" to free ratio.


#### data

- type: object
- default: {}
- example:

```javascript
{
  x: 100,
  y: 50,
  width: 480,
  height: 270
}
```

This parameter object only supports four properties: "x", "y", "width" and "height".

By default, the crop zone will appear in the center of the image.
If you already have values of the last crop and you want to apply them, just set them as option.

**Tips:** It's possible to save the data in cookie or somewhere else and then re-render the cropper after a refresh the page using the data you have.


#### done

- type: function
- default:

```javascript
function(data) {}
```

This function will be provided with the result object. It'll be executed when the cropping zone changes by a move, resize or crop.


#### preview

- type: selector
- default: undefined

A jquery selector, add extra elements for a preview.


#### multiple

- type: boolean
- default: false

By default, the plugin only supports one cropper per page. If you intend to use more than one, just initialize them with this option set to `true`.


#### modal

- type: boolean
- default: true

Show (true) or hide (false) the black modal layer above the cropper.


#### dashed

- type: boolean
- default: true

Show (true) or hide (false) the dashed lines above the dragger.


#### autoCrop

- type: boolean
- default: true

Render the cropping zone automatically when initialize.


#### dragCrop

- type: boolean
- default: true

Enable this to allow the user to remove the current cropping zone and create a new one by dragging over the image.


#### movable

- type: boolean
- default: true

Enable to allow the user to move the cropping zone.


#### resizable

- type: boolean
- default: true

Enable to allow the user to resize the cropping zone.


#### minWidth

- type: number
- default: 0

The minimum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum width.


#### minHeight

- type: number
- default: 0

The minimum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum height.


#### maxWidth

- type: number
- default: Infinity

The maximum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum width.


#### maxHeight

- type: number
- default: Infinity

The maximum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum height.


#### build

- type: function
- default: undefined

An event handler of the "build.cropper" event.


#### built

- type: function
- default: undefined

An event handler of the "built.cropper" event.


#### dragstart

- type: function
- default: undefined

An event handler of the "dragstart.cropper" event.


#### dragmove

- type: function
- default: undefined

An event handler of the "dragmove.cropper" event.


#### dragend

- type: function
- default: undefined

An event handler of the "dragend.cropper" event.


## Methods

#### getData

- Get the current cropped zone data.
- Usage: `$().cropper("getData")`.


#### setData

- Reset the cropping zone.
- Param: an object containing "x", "y", "width" and "height".
- Use with `$().cropper("setData", {width: 480, height: 270})`.

**Tip:** If you want to remove the current data, Just pass an empty object or null. Usage: `$().cropper("setData", {})` or `$().cropper("setData", null)`.


#### setAspectRatio

- Enable to reset the aspect ratio after initialized.
- Param: "auto" or a positive number ("auto" for free ratio).
- Usage: `$().cropper("setAspectRatio", 1.618)`.


#### setImgSrc

- Change the src of the image and restart the Cropper.
- Param: a src string.
- Usage: `$().cropper("setImgSrc", "example.jpg")`.


#### getImgInfo

- Get an object containing image information, contains: "naturalWidth", "naturalHeight", "width", "height", "aspectRatio" and "ratio".
- The "aspectRatio" is the value of "naturalWidth / naturalHeight".
- The "ratio" is the value of "width / naturalWidth".
- Usage: `$().cropper("getImgInfo")`.


#### reset

- Reset the cropping zone to the start state.
- Add a `true` param to reset the cropping zone to the default state.
- Usage: `$().cropper("reset")` or `$().cropper("reset", true)`.


#### release

- Release the cropping zone.
- Usage: `$().cropper("release")`.


#### destroy

- Destroy the Cropper and remove the instance from the target image.
- Usage: `$().cropper("destroy")`.

**Note:** You won't be able to run any more methods after you destroy the cropper.


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

- Chrome 34+
- Firefox 29+
- Internet Explorer 8+
- Opera 21+
- Safari 5.1+

As a jQuery plugin, you can reference to the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](https://github.com/fengyuanchen/cropper/blob/master/LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.
