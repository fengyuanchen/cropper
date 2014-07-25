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

```html
dist/
├── cropper.css     ( 5 KB)
├── cropper.min.css ( 4 KB)
├── cropper.js      (27 KB)
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
        console.log(data);
    }
});
```

**Notes:**
- The size of the cropper was based on the wrapper of the target image, so be sure to wrap the image with a block element.
- The cropper will be re-rendered when the window was resized.
- The result data has be transformed to the true size (based on the natural width and height of the target image).


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
    x1: 100,
    y1: 50,
    width: 480,
    height: 270,
    x2: 580, // optional (x2 = x1 + width)
    y2: 370 // optional (y2 = y1 + height)
}
```


#### noResize

- type: bolean / true or false
- default: false

The noResize, block the resize crop zone 

If you already have a cropped zone data of the image, and you want to re-render it, just set this option.

**Tips:** It's possible to save the data in cookie or other where when a page is unload(abort), and then when the page is reload, get the data and re-render it.

#### done

- type: function
- default:

```javascript
function(data) {}
```

The function will be passed an object data and run when the cropping zone was moving.

#### modal

- type: boolean
- default: true

Show (true) or hide (false) the black modal layer.

#### preview

- type: string
- default: ""

A jquery selector string, add extra elements to show preview.


## Methods

#### enable

- Enable the cropper.
- Param: an optional callback function (will be run when the dragger was rendered).
- Use with `$("#target").cropper("enable")` or `$("#target").cropper("enable", callback)`.

#### disable

- Disable the cropper.
- Use with `$("#target").cropper("disable")`.

#### getData

- Get the current cropped zone data.
- Use with `$("#target").cropper("getData")`.

#### setData

- Reset the cropping zone.
- Param: an object contains "x1", "y1", "width", "height", "x2"(optional), "y2"(optional).
- Use with `$("#target").cropper("setData", {width: 480, height: 270})`.

**Tips:** If you want to remove the data, just use like this: `$("#target").cropper("setData", {})` or `$("#target").cropper("setData", null)`.

#### setAspectRatio

- Enable to reset the aspect ratio after initialized.
- Param: "auto" or a positive number ("auto" for free ratio).
- Use with `$("#target").cropper("setAspectRatio", 1.618)`.

#### setnoResize

- Enable block resize crop zone.
- Param: true to block or false to free resize crop zone.
- Use with `$("#target").cropper("setnoResize", true)`.

#### setImgSrc

- Change the src of the image if need.
- Param: a src string.
- Use with `$("#target").cropper("setImgSrc", "example.jpg")`.

#### getImgInfo

- Get the image information, contains: "naturalWidth", "naturalHeight", "width", "height", "aspectRatio", "ratio".
- The "aspectRatio" is the value of "naturalWidth / naturalHeight".
- The "ratio" is the value of "width / naturalWidth".
- Use with `$("#target").cropper("getImgInfo")`.


## Events

#### dragstart.cropper

This event will be triggered before the cropping zone start to move.

#### dragmove.cropper

This event will be triggered when the cropping zone was moving.

#### dragend.cropper

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
