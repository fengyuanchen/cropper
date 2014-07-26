# [Image Cropper](http://fengyuanchen.github.io/cropper)

A simple jQuery image cropping plugin.

- [Documentation](http://fengyuanchen.github.io/cropper)
- [Demo](http://fengyuanchen.github.io/cropper#overview)


# Features

- Support touch
- Support setup
- Support methods
- Support events
- Cross Browsers


# Main

```
dist/
├── cropper.css     ( 5 KB)
├── cropper.min.css ( 3 KB)
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
    aspectRatio: 16/9,
    done: function(data) {
        console.log(data);
    }
});
```

**Notes:**
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

If you already have a cropped zone data of the image, and you want to re-render it, just set this option.

**Tips:** It's possible to save the data in cookie or other where when a page is unload(abort), and then when the page is reload, get the data and re-render it.


#### done

- type: function
- default:

```javascript
function(data) {}
```

The function will be passed the result object data and run when the cropping zone was changed by move, resize or crop.


#### modal

- type: boolean
- default: true

Show (true) or hide (false) the black modal layer.

#### preview

- type: string
- default: ""

A jquery selector string, add extra elements to show preview.


### New options

The follow options were support from v0.4.0.


#### autoCrop

- type: boolean
- default: true

Render the cropping zone automatically when initialize.


#### dragCrop

- type: boolean
- default: true

Enable to create a new cropping zone when drag on the image.


#### moveable

- type: boolean
- default: true

Enable to move the cropping zone.


#### resizeable

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


### New methods

The follow methods were supported from v0.4.0.


#### reset

- Reset the cropping zone to the start state.
- Add a `true` param to reset the cropping zone to the default state.
- Use with `$("#target").cropper("reset")` or `$("#target").cropper("reset", true)`.


#### release

- Release the cropping zone.
- Use with `$("#target").cropper("release")`.


#### destory

- Destory the Cropper and remove the instance form the target image.
- Use with `$("#target").cropper("destory")`.

**Note:** Don't run any ather methods again when you destory the Cropper.


### Removed methods

The follow methods were removed from v0.4.0, please don't use them again.


#### enable (removed)

- Enable the cropper.
- Param: an optional callback function (will be run when the dragger was rendered).
- Use with `$("#target").cropper("enable")` or `$("#target").cropper("enable", callback)`.


#### disable (removed)

- Disable the cropper.
- Use with `$("#target").cropper("disable")`.



## Events

### New events

The follow events were supported from v0.4.0.


#### build.cropper

This event will be triggered when the Cropper start to build.


#### built.cropper

This event will be triggered when the Cropper was built.


#### render.cropper

This event will be triggered when the cropping zone was changed by move, resize or crop.


### Removed events

The follow events were removed from v0.4.0, please don't use them again.


#### dragstart.cropper (removed)

This event will be triggered before the cropping zone start to move.


#### dragmove.cropper (removed)

This event will be triggered when the cropping zone was moving.


#### dragend.cropper (removed)

This event will be triggered after the cropping zone stop to move.


## Browser Support

- IE 8+
- Chrome 33+
- Firefox 27+
- Safari 5.1+
- Opera 19+

As a jQuery plugin, you can reference to the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](https://github.com/fengyuanchen/cropper/blob/master/LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.
