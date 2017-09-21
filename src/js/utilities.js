import $ from 'jquery';

const REGEXP_DATA_URL_HEAD = /^data:.*,/;
const REGEXP_USERAGENT = /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i;
const navigator = window.navigator;
const IS_SAFARI_OR_UIWEBVIEW = navigator && REGEXP_USERAGENT.test(navigator.userAgent);
const fromCharCode = String.fromCharCode;

export function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
}

export function isUndefined(n) {
  return typeof n === 'undefined';
}

export function toArray(obj, offset) {
  const args = [];

  // This is necessary for IE8
  if (isNumber(offset)) {
    args.push(offset);
  }

  return args.slice.apply(obj, args);
}

// Custom proxy to avoid jQuery's guid
export function proxy(fn, context, ...args) {
  return (...args2) => {
    return fn.apply(context, args.concat(toArray(args2)));
  };
}

export function objectKeys(obj) {
  const keys = [];

  $.each(obj, (key) => {
    keys.push(key);
  });

  return keys;
}

export function isCrossOriginURL(url) {
  const parts = url.match(/^(https?:)\/\/([^:/?#]+):?(\d*)/i);

  return parts && (
    parts[1] !== location.protocol ||
    parts[2] !== location.hostname ||
    parts[3] !== location.port
  );
}

export function addTimestamp(url) {
  const timestamp = `timestamp=${(new Date()).getTime()}`;

  return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
}

export function getImageSize(image, callback) {
  // Modern browsers (ignore Safari, #120 & #509)
  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
    callback(image.naturalWidth, image.naturalHeight);
    return;
  }

  // IE8: Don't use `new Image()` here (#319)
  const newImage = document.createElement('img');

  newImage.onload = function load() {
    callback(this.width, this.height);
  };

  newImage.src = image.src;
}

export function getTransform(options) {
  const transforms = [];
  const translateX = options.translateX;
  const translateY = options.translateY;
  const rotate = options.rotate;
  const scaleX = options.scaleX;
  const scaleY = options.scaleY;

  if (isNumber(translateX) && translateX !== 0) {
    transforms.push(`translateX(${translateX}px)`);
  }

  if (isNumber(translateY) && translateY !== 0) {
    transforms.push(`translateY(${translateY}px)`);
  }

  // Rotate should come first before scale to match orientation transform
  if (isNumber(rotate) && rotate !== 0) {
    transforms.push(`rotate(${rotate}deg)`);
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    transforms.push(`scaleX(${scaleX})`);
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    transforms.push(`scaleY(${scaleY})`);
  }

  return transforms.length ? transforms.join(' ') : 'none';
}

const isFinite = window.isFinite;

export function getContainSizes(
  {
    aspectRatio,
    height,
    width,
  },
) {
  const isValidNumber = (value) => {
    return isFinite(value) && value > 0;
  };

  if (isValidNumber(width) && isValidNumber(height)) {
    if (height * aspectRatio > width) {
      height = width / aspectRatio;
    } else {
      width = height * aspectRatio;
    }
  } else if (isValidNumber(width)) {
    height = width / aspectRatio;
  } else if (isValidNumber(height)) {
    width = height * aspectRatio;
  }

  return {
    width,
    height,
  };
}

export function getRotatedSizes(
  {
    aspectRatio,
    degree,
    height,
    width,
  },
  reversed = false,
) {
  const arc = ((Math.abs(degree) % 90) * Math.PI) / 180;
  const sinArc = Math.sin(arc);
  const cosArc = Math.cos(arc);
  let newWidth;
  let newHeight;

  if (!reversed) {
    newWidth = (width * cosArc) + (height * sinArc);
    newHeight = (width * sinArc) + (height * cosArc);
  } else {
    newWidth = width / (cosArc + (sinArc / aspectRatio));
    newHeight = newWidth / aspectRatio;
  }

  return {
    width: newWidth,
    height: newHeight,
  };
}

export function getSourceCanvas(
  image,
  {
    aspectRatio: imageAspectRatio,
    rotate,
    scaleX,
    scaleY,
  },
  {
    aspectRatio,
    naturalWidth,
    naturalHeight,
  },
  {
    fillColor,
    imageSmoothingEnabled = true,
    imageSmoothingQuality,
    maxWidth,
    maxHeight,
    minWidth,
    minHeight,
  },
) {
  const scaled = isNumber(scaleX) && isNumber(scaleY) && (scaleX !== 1 || scaleY !== 1);
  const rotated = isNumber(rotate) && rotate !== 0;
  let width = naturalWidth;
  let height = naturalHeight;

  const maxSizes = getContainSizes({
    aspectRatio,
    width: maxWidth || Infinity,
    height: maxHeight || Infinity,
  });
  const minSizes = getContainSizes({
    aspectRatio,
    width: minWidth || 0,
    height: minHeight || 0,
  });

  width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
  height = Math.min(maxSizes.height, Math.max(minSizes.height, height));

  const canvas = $('<canvas>')[0];
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  context.fillStyle = fillColor || 'transparent';
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);

  // Rotate first before scale (as in the "getTransform" function)
  if (rotated) {
    context.rotate((rotate * Math.PI) / 180);
  }

  if (scaled) {
    context.scale(scaleX, scaleY);
  }

  context.imageSmoothingEnabled = !!imageSmoothingEnabled;

  if (imageSmoothingQuality) {
    context.imageSmoothingQuality = imageSmoothingQuality;
  }

  let dstWidth = width;
  let dstHeight = height;

  if (rotated) {
    const reversed = getRotatedSizes({
      width,
      height,
      aspectRatio: imageAspectRatio,
      degree: rotate,
    }, true);

    dstWidth = reversed.width;
    dstHeight = reversed.height;
  }

  context.drawImage(
    image,
    Math.floor(-dstWidth / 2),
    Math.floor(-dstHeight / 2),
    Math.floor(dstWidth),
    Math.floor(dstHeight),
  );

  context.restore();

  return canvas;
}

export function getStringFromCharCode(dataView, start, length) {
  let str = '';
  let i;

  for (i = start, length += start; i < length; i += 1) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}

export function getOrientation(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  let length = dataView.byteLength;
  let orientation;
  let exifIDCode;
  let tiffOffset;
  let firstIFDOffset;
  let littleEndian;
  let endianness;
  let app1Start;
  let ifdStart;
  let offset;
  let i;

  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    offset = 2;

    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset;
        break;
      }

      offset += 1;
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

    for (i = 0; i < length; i += 1) {
      offset = ifdStart + (i * 12) + 2;

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

export function dataURLToArrayBuffer(dataURL) {
  const base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  const binary = atob(base64);
  const length = binary.length;
  const arrayBuffer = new ArrayBuffer(length);
  const dataView = new Uint8Array(arrayBuffer);
  let i;

  for (i = 0; i < length; i += 1) {
    dataView[i] = binary.charCodeAt(i);
  }

  return arrayBuffer;
}

// Only available for JPEG image
export function arrayBufferToDataURL(arrayBuffer) {
  const dataView = new Uint8Array(arrayBuffer);
  const length = dataView.length;
  let base64 = '';
  let i;

  for (i = 0; i < length; i += 1) {
    base64 += fromCharCode(dataView[i]);
  }

  return `data:image/jpeg;base64,${btoa(base64)}`;
}
