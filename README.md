# [Image Cropper](http://fengyuanchen.github.io/cropper)

A jQuery image cropping plugin.


# Getting started

## Quick start

Four quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/cropper/zipball/master).
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
<img class="cropper" src="picture.jpg">
```

```javascript
$(".cropper").cropper({
    aspectRatio: 16/9,
    modal: false,
    preview: ".extra-preview",
    done: function(data) {
        console.log(data);
    }
});
```


## Configure

### Setup

Setup with `$("#target").cropper(options)`, or global setup with `$.fn.cropper.setDefaults(options)`.

### Options

#### aspectRatio

- type: string or number
- default: "auto"

The aspect ratio of the cropping zone. e.g., "2", "1.3", "0.5", etc..
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

If you already have a cropped zone data of the image, and you want to re-render it, just set this option.

**Tips:** It's possible to save the data in cookie or other where when a page is unload(abort), and then when the page is reload, get the data and re-render it.

#### done

- type: function
- default:

```javascript
function(data) {}
```

The function will be passed a object data and run when the cropping zone was moving.

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
- use with `$("#target").cropper("enable")`.

#### disable

- Disable the cropper.
- use with `$("#target").cropper("disable")`.

#### getData

- Get the current cropped zone data.
- Use with `$("#target").cropper("getData")`.

#### setData

- Reset the cropping zone.
- Param: A object contains "x1", "y1", "width", "height", "x2"(optional), "y2"(optional).
- Use with `$("#target").cropper("setData", {width: 480, height: 270})`.

#### setAspectRatio

- Enable to reset the aspect ratio after initialization.
- Param: a positive number.
- Use with `$("#target").cropper("setAspectRatio", 1.618)`.


#### getImgInfo

- Get the image information, contains: "naturalWidth", "naturalHeight", "width", "height", "aspectRatio", "ratio".
- The "aspectRatio" is the value of "naturalWidth / naturalHeight".
- The "ratio" is the value of "width / naturalWidth".
- Use with `$("#target").cropper("getImgInfo")`.


## Browser Support

- IE 8+
- Chrome 33+
- Firefox 27+
- Safari 5.1+
- Opera 19+

As a jQuery plugin, you can reference the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](https://github.com/fengyuanchen/cropper/blob/master/LICENSE)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.
