# [Image Cropper](http://fengyuanchen.github.io/cropper)

A jQuery image cropping plugin.


## Getting started

### Installation

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link rel="stylesheet" href="/path/to/cropper.css">
<script src="/path/to/cropper.js"></script>
```

### Usage

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

### Options

Setup with `$("#target").cropper(options)`, or global setup with `$.fn.cropper.setDefaults(options)`.

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