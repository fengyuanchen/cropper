# Cropper

[![Build Status](https://travis-ci.org/fengyuanchen/cropper.svg)](https://travis-ci.org/fengyuanchen/cropper) [![Downloads](https://img.shields.io/npm/dm/cropper.svg)](https://www.npmjs.com/package/cropper) [![Version](https://img.shields.io/npm/v/cropper.svg)](https://www.npmjs.com/package/cropper)

> A simple jQuery image cropping plugin. As of v4.0.0, the core code of Cropper is replaced with [Cropper.js](https://github.com/fengyuanchen/cropperjs).

- [Demo](https://fengyuanchen.github.io/cropper)
- [Cropper.js](https://github.com/fengyuanchen/cropperjs) - JavaScript image cropper (**recommended**)
- [jquery-cropper](https://github.com/fengyuanchen/jquery-cropper) - A jQuery plugin wrapper for Cropper.js (**recommended** for jQuery users to use this instead of Cropper)

## Main

```text
dist/
├── cropper.css
├── cropper.min.css   (compressed)
├── cropper.js        (UMD)
├── cropper.min.js    (UMD, compressed)
├── cropper.common.js (CommonJS, default)
└── cropper.esm.js    (ES Module)
```

## Getting started

### Installation

```shell
npm install cropper jquery
```

Include files:

```html
<script src="/path/to/jquery.js"></script><!-- jQuery is required -->
<link  href="/path/to/cropper.css" rel="stylesheet">
<script src="/path/to/cropper.js"></script>
```

### Usage

Initialize with `$.fn.cropper` method.

```html
<!-- Wrap the image or canvas element with a block element (container) -->
<div>
  <img id="image" src="picture.jpg">
</div>
```

```css
/* Limit image width to avoid overflow the container */
img {
  max-width: 100%; /* This rule is very important, please do not ignore this! */
}
```

```js
var $image = $('#image');

$image.cropper({
  aspectRatio: 16 / 9,
  crop: function(event) {
    console.log(event.detail.x);
    console.log(event.detail.y);
    console.log(event.detail.width);
    console.log(event.detail.height);
    console.log(event.detail.rotate);
    console.log(event.detail.scaleX);
    console.log(event.detail.scaleY);
  }
});

// Get the Cropper.js instance after initialized
var cropper = $image.data('cropper');
```

## Options

See the available [options](https://github.com/fengyuanchen/cropperjs#options) of Cropper.js.

```js
$().cropper(options);
```

## Methods

See the available [methods](https://github.com/fengyuanchen/cropperjs#methods) of Cropper.js.

```js
$().cropper('method', argument1, , argument2, ..., argumentN);
```

## Events

See the available [events](https://github.com/fengyuanchen/cropperjs#events) of Cropper.js.

```js
$().on('event', handler);
```

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

## Browser support

It is the same as the [browser support of Cropper.js](https://github.com/fengyuanchen/cropperjs#browser-support). As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing

Please read through our [contributing guidelines](.github/CONTRIBUTING.md).

## Versioning

Maintained under the [Semantic Versioning guidelines](http://semver.org/).

## License

[MIT](http://opensource.org/licenses/MIT) © [Chen Fengyuan](http://chenfengyuan.com)
