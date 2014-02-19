# Image Cropper

A jquery image cropping plugin.



## Installation

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link rel="stylesheet" href="/path/to/cropper.css">
<script src="/path/to/cropper.js"></script>
```


## Usage

#### Method 1:

Auto init by add the `cropper` attribute to the element.

```html
<img cropper src="example.png">
```
#### Method 2:

Init with the jQuery method `cropper`.

```html
<img class="cropper" src="example.png">
```

```javascript
$(".cropper").cropper();
```


## Setup

### Set defaults

For example:

```javascript
$.fn.cropper.setDefaults({
	aspectRatio: 16/9,
    modal: false,
    preview: ".extra-preview",

    done: function(data) {
        console.log(data);
    }
});
```

### Options

#### aspectRatio

* type: number
* default: 1

The aspect ratio of the cropping zone. (e.g., "16/9", "4/3", "2/1", etc.)

#### done

* type: function
* default:

```javascript
function(data) {}
```

The function will be run and put in the result data (a plain object) when the cropping zone was moved.

#### modal

* type: boolean
* default: true

Show the black modal layer.

#### preview

* type: string
* default: undefined

A jquery selector string, add extra elements to show preview.