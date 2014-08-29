# [Image Cropper](http://fengyuanchen.github.io/cropper)

A simple jQuery image cropping plugin.

- [Documentation](http://fengyuanchen.github.io/cropper)
- [Demo](http://fengyuanchen.github.io/cropper#overview)


# Features

- Support touch
- Support setup
- Support methods
- Support events
- Support canvas
- Cross Browsers


# Main

```
dist/
├── cropper.css     ( 4 KB)
├── cropper.min.css ( 3 KB)
├── cropper.js      (26 KB)
└── cropper.min.js  (11 KB)
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
  aspectRatio: 16/9,
  done: function(data) {
    // Crop image with the data
  }
});
```

**Notes:**
- Please only use the cropper on a visible image. In other words, don't try to use the cropper on a image which was wrapped by a hidden element.
- The size of the cropper was based on the wrapper of the target image, so be sure to wrap the image with a block element.
- The cropper will be automatic re-rendered when the window was resized.
- The result data has transformed to real size (based on the original image).


## Options

Setup with `$("#target").cropper(options)`, or global setup with `$.fn.cropper.setDefaults(options)`.


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

Only support four options: "x", "y", "width", "height".

By default, the cropped zone will appear in the center of the image. If you already have a cropped zone data of the image, and you want to re-render it, just set this option.

**Tips:** It's possible to save the data in cookie or other where when a page is unload(abort), and then when the page is reload, get the data and re-render it.


#### done

- type: function
- default:

```javascript
function(data) {}
```

The function will be passed the result object data and run when the cropping zone was changed by move, resize or crop.


#### preview

- type: selector
- default: undefined

A jquery selector, add extra elements for preview.


#### modal

- type: boolean
- default: true

Show (true) or hide (false) the black modal layer.


#### multiple

- type: boolean
- default: false

By default, this plugin only support one cropper in one page, if you need two or more croppers, you must set this option with `true` from the second cropper.


#### autoCrop

- type: boolean
- default: true

Render the cropping zone automatically when initialize.


#### dragCrop

- type: boolean
- default: true

Enable to create a new cropping zone when drag on the image.


#### movable

- type: boolean
- default: true

Enable to move the cropping zone.


#### resizable

- type: boolean
- default: true

Enable to resize the cropping zone.


#### minHeight

- type: number
- default: 0

The minimum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum height.


#### minWidth

- type: number
- default: 0

The minimum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this minimum width.


#### maxHeight

- type: number
- default: Infinity

The maximum height (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum height.


#### maxWidth

- type: number
- default: Infinity

The maximum width (px of original image) of the cropping zone.
Use this option only when you are sure that the image has this maximum width.

## Methods

#### getData

- Get the current cropped zone data.
- Use with `$("#target").cropper("getData")`.


#### setData

- Reset the cropping zone.
- Param: an object contains "x", "y", "width", "height".
- Use with `$("#target").cropper("setData", {width: 480, height: 270})`.

**Tips:** If you want to remove the data, just use like this: `$("#target").cropper("setData", {})` or `$("#target").cropper("setData", null)`.


#### setAspectRatio

- Enable to reset the aspect ratio after initialized.
- Param: "auto" or a positive number ("auto" for free ratio).
- Use with `$("#target").cropper("setAspectRatio", 1.618)`.


#### setImgSrc

- Change the src of the image and restart the Cropper.
- Param: a src string.
- Use with `$("#target").cropper("setImgSrc", "example.jpg")`.


#### getImgInfo

- Get the image information, contains: "naturalWidth", "naturalHeight", "width", "height", "aspectRatio", "ratio".
- The "aspectRatio" is the value of "naturalWidth / naturalHeight".
- The "ratio" is the value of "width / naturalWidth".
- Use with `$("#target").cropper("getImgInfo")`.


#### reset

- Reset the cropping zone to the start state.
- Add a `true` param to reset the cropping zone to the default state.
- Use with `$("#target").cropper("reset")` or `$("#target").cropper("reset", true)`.


#### release

- Release the cropping zone.
- Use with `$("#target").cropper("release")`.


#### destroy

- Destroy the Cropper and remove the instance form the target image.
- Use with `$("#target").cropper("destroy")`.

**Note:** Don't run any ather methods again when you destroy the Cropper.

## Events


#### build.cropper

This event will be fired when the Cropper start to build.


#### built.cropper

This event will be fired when the Cropper was built.


#### render.cropper

This event will be fired when the cropping zone was changed by move, resize or crop.


## No conflict

If you have to use other plugin with the same namespace, just call the `$.fn.cropper.noConflict` method to revert it.

```
<script src="other_plugin.js"></script>
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
