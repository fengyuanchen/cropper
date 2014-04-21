# [Image Cropper](http://fengyuanchen.github.io/cropper)

A jQuery image cropping plugin.


# Getting started


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

* type: number
* default: 1

The aspect ratio of the cropping zone. e.g., "2", "1.3", "0.5", etc..

#### done

* type: function
* default:

```javascript
function(data) {}
```

The function will be passed a object data and run when the cropping zone was moving.

#### modal

* type: boolean
* default: true

Show (true) or hide (false) the black modal layer.

#### preview

* type: string
* default: ""

A jquery selector string, add extra elements to show preview.


## Methods

#### enable

Enable the cropper, use with `$("#target").cropper("enable")`.

#### disable

Disable the cropper, use with `$("#target").cropper("disable")`.


## Browser Support

* IE 8+
* Chrome 33+
* Firefox 27+
* Safari 5.1+
* Opera 19+

As a jQuery plugin, you can reference the [jQuery Browser Support](http://jquery.com/browser-support/).


## [License](https://github.com/fengyuanchen/cropper/blob/master/LICENSE)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.
