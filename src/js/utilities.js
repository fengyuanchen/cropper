  function isNumber(n) {
    return typeof n === 'number';
  }

  function isString(n) {
    return typeof n === 'string';
  }

  function isUndefined(n) {
    return typeof n === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    if (isNumber(offset)) { // It's necessary for IE8
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  // Custom proxy to avoid jQuery's guid
  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function isCrossOriginURL(url) {
    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

    if (parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port)) {
      return true;
    }

    return false;
  }

  function addTimestamp(url) {
    var timestamp = 'timestamp=' + (new Date()).getTime();

    return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
  }

  function getRotateValue(degree) {
    return degree ? 'rotate(' + degree + 'deg)' : 'none';
  }

  function getRotatedSizes(data) {
    var deg = abs(data.degree) % 180,
        arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;

    return {
      width: data.width * cos(arc) + data.height * sin(arc),
      height: data.width * sin(arc) + data.height * cos(arc)
    };
  }

  function getSourceCanvas(image, data) {
    var canvas = $('<canvas>')[0],
        context = canvas.getContext('2d'),
        width = data.naturalWidth,
        height = data.naturalHeight,
        rotate = data.rotate,
        rotated = getRotatedSizes({
          width: width,
          height: height,
          degree: rotate
        });

    if (rotate) {
      canvas.width = rotated.width;
      canvas.height = rotated.height;
      context.save();
      context.translate(rotated.width / 2, rotated.height / 2);
      context.rotate(rotate * Math.PI / 180);
      context.drawImage(image, -width / 2, -height / 2, width, height);
      context.restore();
    } else {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
    }

    return canvas;
  }
