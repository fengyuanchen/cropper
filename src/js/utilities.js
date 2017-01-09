  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  function isUndefined(n) {
    return typeof n === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    // This is necessary for IE8
    if (isNumber(offset)) {
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

  function objectKeys(obj) {
    var keys = [];

    $.each(obj, function (key) {
      keys.push(key);
    });

    return keys;
  }

  function isCrossOriginURL(url) {
    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

    return parts && (
      parts[1] !== location.protocol ||
      parts[2] !== location.hostname ||
      parts[3] !== location.port
    );
  }

  function addTimestamp(url) {
    var timestamp = 'timestamp=' + (new Date()).getTime();

    return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
  }

  function getCrossOrigin(crossOrigin) {
    return crossOrigin ? ' crossOrigin="' + crossOrigin + '"' : '';
  }

  function getImageSize(image, callback) {
    var newImage;

    // Modern browsers (ignore Safari, #120 & #509)
    if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
      return callback(image.naturalWidth, image.naturalHeight);
    }

    // IE8: Don't use `new Image()` here (#319)
    newImage = document.createElement('img');

    newImage.onload = function () {
      callback(this.width, this.height);
    };

    newImage.src = image.src;
  }

  function getTransform(options) {
    var transforms = [];
    var rotate = options.rotate;
    var scaleX = options.scaleX;
    var scaleY = options.scaleY;

    // Rotate should come first before scale to match orientation transform
    if (isNumber(rotate) && rotate !== 0) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (isNumber(scaleX) && scaleX !== 1) {
      transforms.push('scaleX(' + scaleX + ')');
    }

    if (isNumber(scaleY) && scaleY !== 1) {
      transforms.push('scaleY(' + scaleY + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  }

  function getRotatedSizes(data, isReversed) {
    var deg = abs(data.degree) % 180;
    var arc = (deg > 90 ? (180 - deg) : deg) * Math.PI / 180;
    var sinArc = sin(arc);
    var cosArc = cos(arc);
    var width = data.width;
    var height = data.height;
    var aspectRatio = data.aspectRatio;
    var newWidth;
    var newHeight;

    if (!isReversed) {
      newWidth = width * cosArc + height * sinArc;
      newHeight = width * sinArc + height * cosArc;
    } else {
      newWidth = width / (cosArc + sinArc / aspectRatio);
      newHeight = newWidth / aspectRatio;
    }

    return {
      width: newWidth,
      height: newHeight
    };
  }

  function getSourceCanvas(image, data) {
    var canvas = $('<canvas>')[0];
    var context = canvas.getContext('2d');
    var dstX = 0;
    var dstY = 0;
    var dstWidth = data.naturalWidth;
    var dstHeight = data.naturalHeight;
    var rotate = data.rotate;
    var scaleX = data.scaleX;
    var scaleY = data.scaleY;
    var scalable = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
    var rotatable = isNumber(rotate) && rotate !== 0;
    var advanced = rotatable || scalable;
    var canvasWidth = dstWidth * abs(scaleX || 1);
    var canvasHeight = dstHeight * abs(scaleY || 1);
    var translateX;
    var translateY;
    var rotated;

    if (scalable) {
      translateX = canvasWidth / 2;
      translateY = canvasHeight / 2;
    }

    if (rotatable) {
      rotated = getRotatedSizes({
        width: canvasWidth,
        height: canvasHeight,
        degree: rotate
      });

      canvasWidth = rotated.width;
      canvasHeight = rotated.height;
      translateX = canvasWidth / 2;
      translateY = canvasHeight / 2;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (advanced) {
      dstX = -dstWidth / 2;
      dstY = -dstHeight / 2;

      context.save();
      context.translate(translateX, translateY);
    }

    // Rotate should come first before scale as in the "getTransform" function
    if (rotatable) {
      context.rotate(rotate * Math.PI / 180);
    }

    if (scalable) {
      context.scale(scaleX, scaleY);
    }

    context.drawImage(image, floor(dstX), floor(dstY), floor(dstWidth), floor(dstHeight));

    if (advanced) {
      context.restore();
    }

    return canvas;
  }

  function getPointersCenter(pointers) {
    var pageX = 0;
    var pageY = 0;
    var count = 0;

    $.each(pointers, function (i, pointer) {
      pageX += pointer.startX;
      pageY += pointer.startY;
      count += 1;
    });

    pageX /= count;
    pageY /= count;

    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  function getPointer(event, endOnly) {
    // IE8  has `event.pageX/Y`, but not `event.originalEvent.pageX/Y`
    // IE10 has `event.originalEvent.pageX/Y`, but not `event.pageX/Y`
    var originalEvent = event.originalEvent;
    var pageX = event.pageX || originalEvent && originalEvent.pageX;
    var pageY = event.pageY || originalEvent && originalEvent.pageY;
    var end = {
      endX: pageX,
      endY: pageY
    };

    if (endOnly) {
      return end;
    }

    return $.extend({
      startX: pageX,
      startY: pageY
    }, end);
  }

  function getMaxZoomRatio(pointers) {
    var pointers2 = $.extend({}, pointers);
    var ratios = [];

    $.each(pointers, function (pointerId, pointer) {
      delete pointers2[pointerId];

      $.each(pointers2, function (pointerId2, pointer2) {
        var x1 = abs(pointer.startX - pointer2.startX);
        var y1 = abs(pointer.startY - pointer2.startY);
        var x2 = abs(pointer.endX - pointer2.endX);
        var y2 = abs(pointer.endY - pointer2.endY);
        var z1 = sqrt((x1 * x1) + (y1 * y1));
        var z2 = sqrt((x2 * x2) + (y2 * y2));
        var ratio = (z2 - z1) / z1;

        ratios.push(ratio);
      });
    });

    ratios.sort(function (a, b) {
      return abs(a) < abs(b);
    });

    return ratios[0];
  }

  function getStringFromCharCode(dataView, start, length) {
    var str = '';
    var i;

    for (i = start, length += start; i < length; i++) {
      str += fromCharCode(dataView.getUint8(i));
    }

    return str;
  }

  function getOrientation(arrayBuffer) {
    var dataView = new DataView(arrayBuffer);
    var length = dataView.byteLength;
    var orientation;
    var exifIDCode;
    var tiffOffset;
    var firstIFDOffset;
    var littleEndian;
    var endianness;
    var app1Start;
    var ifdStart;
    var offset;
    var i;

    // Only handle JPEG image (start by 0xFFD8)
    if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
      offset = 2;

      while (offset < length) {
        if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
          app1Start = offset;
          break;
        }

        offset++;
      }
    }

    if (app1Start) {
      exifIDCode = app1Start + 4;
      tiffOffset = app1Start + 10;

      if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
        endianness = dataView.getUint16(tiffOffset);
        littleEndian = endianness === 0x4949;

        if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
          if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
            firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

            if (firstIFDOffset >= 0x00000008) {
              ifdStart = tiffOffset + firstIFDOffset;
            }
          }
        }
      }
    }

    if (ifdStart) {
      length = dataView.getUint16(ifdStart, littleEndian);

      for (i = 0; i < length; i++) {
        offset = ifdStart + i * 12 + 2;

        if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {

          // 8 is the offset of the current tag's value
          offset += 8;

          // Get the original orientation value
          orientation = dataView.getUint16(offset, littleEndian);

          // Override the orientation with its default value for Safari (#120)
          if (IS_SAFARI_OR_UIWEBVIEW) {
            dataView.setUint16(offset, 1, littleEndian);
          }

          break;
        }
      }
    }

    return orientation;
  }

  function dataURLToArrayBuffer(dataURL) {
    var base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
    var binary = atob(base64);
    var length = binary.length;
    var arrayBuffer = new ArrayBuffer(length);
    var dataView = new Uint8Array(arrayBuffer);
    var i;

    for (i = 0; i < length; i++) {
      dataView[i] = binary.charCodeAt(i);
    }

    return arrayBuffer;
  }

  // Only available for JPEG image
  function arrayBufferToDataURL(arrayBuffer) {
    var dataView = new Uint8Array(arrayBuffer);
    var length = dataView.length;
    var base64 = '';
    var i;

    for (i = 0; i < length; i++) {
      base64 += fromCharCode(dataView[i]);
    }

    return 'data:image/jpeg;base64,' + btoa(base64);
  }

  function vector(p1, p2) {
    return {
      x: (p2.x - p1.x),
      y: (p2.y - p1.y)
    };
  }

  function dot(u, v) {
    return u.x * v.x + u.y * v.y;
  }

  function pointInRectangle(m, r) {
    var AB = vector(r.A, r.B);
    var AM = vector(r.A, m);
    var BC = vector(r.B, r.C);
    var BM = vector(r.B, m);
    var dotABAM = dot(AB, AM);
    var dotABAB = dot(AB, AB);
    var dotBCBM = dot(BC, BM);
    var dotBCBC = dot(BC, BC);
    return 0 <= dotABAM && dotABAM <= dotABAB && 0 <= dotBCBM && dotBCBM <= dotBCBC;
  }

  function rotatePoint(pivot, point, angle) {
    // Rotate clockwise, angle in radians
    var x = round((cos(angle) * (point.x - pivot.x)) -
                       (sin(angle) * (point.y - pivot.y)) +
                       pivot.x),
        y = round((sin(angle) * (point.x - pivot.x)) +
                       (cos(angle) * (point.y - pivot.y)) +
                       pivot.y);
    return { x: x, y: y };
  }

  function cropBoxInImage(cropBox, canvas, image) {
    var cropBoxPoints = {
      A: { x: round(cropBox.left), y: round(cropBox.top) },
      B: { x: round(cropBox.left + cropBox.width), y: round(cropBox.top) },
      C: { x: round(cropBox.left + cropBox.width), y: round(cropBox.top + cropBox.height) },
      D: { x: round(cropBox.left), y: round(cropBox.top + cropBox.height) }
    };

    var centers = {
      x: canvas.left + image.left + (image.width / 2),
      y: canvas.top + image.top + (image.height / 2)
    };
    var angle = (image.rotate ? image.rotate : 0) * Math.PI / 180;
    var imagePoints = {
      A: rotatePoint(centers, { x: canvas.left + image.left, y: canvas.top + image.top }, angle),
      B: rotatePoint(centers, { x: canvas.left + image.left + image.width, y: canvas.top + image.top }, angle),
      C: rotatePoint(centers, { x: canvas.left + image.left + image.width, y: canvas.top + image.top + image.height }, angle),
      D: rotatePoint(centers, { x: canvas.left + image.left, y: canvas.top + image.top + image.height }, angle)
    };

    return pointInRectangle(cropBoxPoints.A, imagePoints) &&
        pointInRectangle(cropBoxPoints.B, imagePoints) &&
        pointInRectangle(cropBoxPoints.C, imagePoints) &&
        pointInRectangle(cropBoxPoints.D, imagePoints)
    ;
  }

  function largestContainedCropBox(image, cropBoxAspectRatio) {
    var imageShortestSide = min(image.width, image.height);
    var side = sqrt(pow(imageShortestSide, 2) / 2);
    var dimensions = {};
    if (cropBoxAspectRatio < 1) {
      // Portrait:
      dimensions = { height: side, width: side * cropBoxAspectRatio };
    } else {
      dimensions = { width: side, height: side / cropBoxAspectRatio };
    }
    return dimensions;
  }
