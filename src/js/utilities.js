import $ from 'jquery';
import {
  WINDOW,
} from './constants';

/**
 * Check if the given value is a string.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a string, else `false`.
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Check if the given value is not a number.
 */
export const isNaN = Number.isNaN || WINDOW.isNaN;

/**
 * Check if the given value is a number.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is a number, else `false`.
 */
export function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if the given value is undefined.
 * @param {*} value - The value to check.
 * @returns {boolean} Returns `true` if the given value is undefined, else `false`.
 */
export function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * Takes a function and returns a new one that will always have a particular context.
 * Custom proxy to avoid jQuery's guid.
 * @param {Function} fn - The target function.
 * @param {Object} context - The new context for the function.
 * @returns {Function} The new function.
 */
export function proxy(fn, context, ...args) {
  return (...args2) => fn.apply(context, args.concat(args2));
}

/**
 * Get the own enumerable properties of a given object.
 * @param {Object} obj - The target object.
 * @returns {Array} All the own enumerable properties of the given object.
 */
export const objectKeys = Object.keys || function objectKeys(obj) {
  const keys = [];

  $.each(obj, (key) => {
    keys.push(key);
  });

  return keys;
};

const REGEXP_DECIMALS = /\.\d*(?:0|9){12}\d*$/i;

/**
 * Normalize decimal number.
 * Check out {@link http://0.30000000000000004.com/ }
 * @param {number} value - The value to normalize.
 * @param {number} [times=100000000000] - The times for normalizing.
 * @returns {number} Returns the normalized number.
 */
export function normalizeDecimalNumber(value, times = 100000000000) {
  return REGEXP_DECIMALS.test(value) ? (Math.round(value * times) / times) : value;
}

const { location } = WINDOW;
const REGEXP_ORIGINS = /^(https?:)\/\/([^:/?#]+):?(\d*)/i;

/**
 * Check if the given URL is a cross origin URL.
 * @param {string} url - The target URL.
 * @returns {boolean} Returns `true` if the given URL is a cross origin URL, else `false`.
 */
export function isCrossOriginURL(url) {
  const parts = url.match(REGEXP_ORIGINS);

  return parts && (
    parts[1] !== location.protocol ||
    parts[2] !== location.hostname ||
    parts[3] !== location.port
  );
}

/**
 * Add timestamp to the given URL.
 * @param {string} url - The target URL.
 * @returns {string} The result URL.
 */
export function addTimestamp(url) {
  const timestamp = `timestamp=${(new Date()).getTime()}`;

  return (url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp);
}

/**
 * Get transform values base on the given object.
 * @param {Object} obj - The target object.
 * @returns {string} A string contains transform values.
 */
export function getTransformValues({
  rotate,
  scaleX,
  scaleY,
  translateX,
  translateY,
}) {
  const values = [];

  if (isNumber(translateX) && translateX !== 0) {
    values.push(`translateX(${translateX}px)`);
  }

  if (isNumber(translateY) && translateY !== 0) {
    values.push(`translateY(${translateY}px)`);
  }

  // Rotate should come first before scale to match orientation transform
  if (isNumber(rotate) && rotate !== 0) {
    values.push(`rotate(${rotate}deg)`);
  }

  if (isNumber(scaleX) && scaleX !== 1) {
    values.push(`scaleX(${scaleX})`);
  }

  if (isNumber(scaleY) && scaleY !== 1) {
    values.push(`scaleY(${scaleY})`);
  }

  return values.length ? values.join(' ') : 'none';
}

const { navigator } = WINDOW;
const IS_SAFARI_OR_UIWEBVIEW = navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);

/**
 * Get an image's natural sizes.
 * @param {string} image - The target image.
 * @param {Function} callback - The callback function.
 */
export function getImageNaturalSizes(image, callback) {
  // Modern browsers (except Safari)
  if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
    callback(image.naturalWidth, image.naturalHeight);
    return;
  }

  const newImage = document.createElement('img');

  newImage.onload = () => {
    callback(newImage.width, newImage.height);
  };

  newImage.src = image.src;
}

/**
 * Get the max ratio of a group of pointers.
 * @param {string} pointers - The target pointers.
 * @returns {number} The result ratio.
 */
export function getMaxZoomRatio(pointers) {
  const pointers2 = $.extend({}, pointers);
  const ratios = [];

  $.each(pointers, (pointerId, pointer) => {
    delete pointers2[pointerId];

    $.each(pointers2, (pointerId2, pointer2) => {
      const x1 = Math.abs(pointer.startX - pointer2.startX);
      const y1 = Math.abs(pointer.startY - pointer2.startY);
      const x2 = Math.abs(pointer.endX - pointer2.endX);
      const y2 = Math.abs(pointer.endY - pointer2.endY);
      const z1 = Math.sqrt((x1 * x1) + (y1 * y1));
      const z2 = Math.sqrt((x2 * x2) + (y2 * y2));
      const ratio = (z2 - z1) / z1;

      ratios.push(ratio);
    });
  });

  ratios.sort((a, b) => Math.abs(a) < Math.abs(b));

  return ratios[0];
}

/**
 * Get a pointer from an event object.
 * @param {Object} event - The target event object.
 * @param {boolean} endOnly - Indicates if only returns the end point coordinate or not.
 * @returns {Object} The result pointer contains start and/or end point coordinates.
 */
export function getPointer({ pageX, pageY }, endOnly) {
  const end = {
    endX: pageX,
    endY: pageY,
  };

  if (endOnly) {
    return end;
  }

  return $.extend({
    startX: pageX,
    startY: pageY,
  }, end);
}

/**
 * Get the center point coordinate of a group of pointers.
 * @param {Object} pointers - The target pointers.
 * @returns {Object} The center point coordinate.
 */
export function getPointersCenter(pointers) {
  let pageX = 0;
  let pageY = 0;
  let count = 0;

  $.each(pointers, (pointerId, { startX, startY }) => {
    pageX += startX;
    pageY += startY;
    count += 1;
  });

  pageX /= count;
  pageY /= count;

  return {
    pageX,
    pageY,
  };
}

/**
 * Check if the given value is a finite number.
 */
export const isFinite = Number.isFinite || WINDOW.isFinite;

/**
 * Get the max sizes in a rectangle under the given aspect ratio.
 * @param {Object} data - The original sizes.
 * @returns {Object} The result sizes.
 */
export function getContainSizes({
  aspectRatio,
  height,
  width,
}) {
  const isValidNumber = value => isFinite(value) && value > 0;

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

/**
 * Get the new sizes of a rectangle after rotated.
 * @param {Object} data - The original sizes.
 * @returns {Object} The result sizes.
 */
export function getRotatedSizes({ width, height, degree }) {
  degree = Math.abs(degree);

  if (degree % 180 === 90) {
    return {
      width: height,
      height: width,
    };
  }

  const arc = ((degree % 90) * Math.PI) / 180;
  const sinArc = Math.sin(arc);
  const cosArc = Math.cos(arc);

  return {
    width: (width * cosArc) + (height * sinArc),
    height: (width * sinArc) + (height * cosArc),
  };
}

/**
 * Get a canvas which drew the given image.
 * @param {HTMLImageElement} image - The image for drawing.
 * @param {Object} imageData - The image data.
 * @param {Object} canvasData - The canvas data.
 * @param {Object} options - The options.
 * @returns {HTMLCanvasElement} The result canvas.
 */
export function getSourceCanvas(
  image,
  {
    naturalWidth: imageNaturalWidth,
    naturalHeight: imageNaturalHeight,
    rotate = 0,
    scaleX = 1,
    scaleY = 1,
  },
  {
    aspectRatio,
    naturalWidth,
    naturalHeight,
  },
  {
    fillColor = 'transparent',
    imageSmoothingEnabled = true,
    imageSmoothingQuality = 'low',
    maxWidth = Infinity,
    maxHeight = Infinity,
    minWidth = 0,
    minHeight = 0,
  },
) {
  const maxSizes = getContainSizes({
    aspectRatio,
    width: maxWidth,
    height: maxHeight,
  });
  const minSizes = getContainSizes({
    aspectRatio,
    width: minWidth,
    height: minHeight,
  });
  const width = Math.min(maxSizes.width, Math.max(minSizes.width, naturalWidth));
  const height = Math.min(maxSizes.height, Math.max(minSizes.height, naturalHeight));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const params = [
    -imageNaturalWidth / 2,
    -imageNaturalHeight / 2,
    imageNaturalWidth,
    imageNaturalHeight,
  ];

  canvas.width = normalizeDecimalNumber(width);
  canvas.height = normalizeDecimalNumber(height);
  context.fillStyle = fillColor;
  context.fillRect(0, 0, width, height);
  context.save();
  context.translate(width / 2, height / 2);
  context.rotate((rotate * Math.PI) / 180);
  context.scale(scaleX, scaleY);
  context.imageSmoothingEnabled = !!imageSmoothingEnabled;
  context.imageSmoothingQuality = imageSmoothingQuality;
  context.drawImage(image, ...$.map(params, param => Math.floor(normalizeDecimalNumber(param))));
  context.restore();
  return canvas;
}

const { fromCharCode } = String;

/**
 * Get string from char code in data view.
 * @param {DataView} dataView - The data view for read.
 * @param {number} start - The start index.
 * @param {number} length - The read length.
 * @returns {string} The read result.
 */
export function getStringFromCharCode(dataView, start, length) {
  let str = '';
  let i;

  length += start;

  for (i = start; i < length; i += 1) {
    str += fromCharCode(dataView.getUint8(i));
  }

  return str;
}

const REGEXP_DATA_URL_HEAD = /^data:.*,/;

/**
 * Transform Data URL to array buffer.
 * @param {string} dataURL - The Data URL to transform.
 * @returns {ArrayBuffer} The result array buffer.
 */
export function dataURLToArrayBuffer(dataURL) {
  const base64 = dataURL.replace(REGEXP_DATA_URL_HEAD, '');
  const binary = atob(base64);
  const arrayBuffer = new ArrayBuffer(binary.length);
  const uint8 = new Uint8Array(arrayBuffer);

  $.each(uint8, (i) => {
    uint8[i] = binary.charCodeAt(i);
  });

  return arrayBuffer;
}

/**
 * Transform array buffer to Data URL.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to transform.
 * @param {string} mimeType - The mime type of the Data URL.
 * @returns {string} The result Data URL.
 */
export function arrayBufferToDataURL(arrayBuffer, mimeType) {
  const uint8 = new Uint8Array(arrayBuffer);
  let data = '';

  // TypedArray.prototype.forEach is not supported in some browsers.
  $.each(uint8, (i, value) => {
    data += fromCharCode(value);
  });

  return `data:${mimeType};base64,${btoa(data)}`;
}

/**
 * Get orientation value from given array buffer.
 * @param {ArrayBuffer} arrayBuffer - The array buffer to read.
 * @returns {number} The read orientation value.
 */
export function getOrientation(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  let orientation;
  let littleEndian;
  let app1Start;
  let ifdStart;

  // Only handle JPEG image (start by 0xFFD8)
  if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
    const length = dataView.byteLength;
    let offset = 2;

    while (offset < length) {
      if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
        app1Start = offset;
        break;
      }

      offset += 1;
    }
  }

  if (app1Start) {
    const exifIDCode = app1Start + 4;
    const tiffOffset = app1Start + 10;

    if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
      const endianness = dataView.getUint16(tiffOffset);

      littleEndian = endianness === 0x4949;

      if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
        if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
          const firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

          if (firstIFDOffset >= 0x00000008) {
            ifdStart = tiffOffset + firstIFDOffset;
          }
        }
      }
    }
  }

  if (ifdStart) {
    const length = dataView.getUint16(ifdStart, littleEndian);
    let offset;
    let i;

    for (i = 0; i < length; i += 1) {
      offset = ifdStart + (i * 12) + 2;

      if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
        // 8 is the offset of the current tag's value
        offset += 8;

        // Get the original orientation value
        orientation = dataView.getUint16(offset, littleEndian);

        // Override the orientation with its default value
        dataView.setUint16(offset, 1, littleEndian);
        break;
      }
    }
  }

  return orientation;
}

/**
 * Parse Exif Orientation value.
 * @param {number} orientation - The orientation to parse.
 * @returns {Object} The parsed result.
 */
export function parseOrientation(orientation) {
  let rotate = 0;
  let scaleX = 1;
  let scaleY = 1;

  switch (orientation) {
    // Flip horizontal
    case 2:
      scaleX = -1;
      break;

    // Rotate left 180°
    case 3:
      rotate = -180;
      break;

    // Flip vertical
    case 4:
      scaleY = -1;
      break;

    // Flip vertical and rotate right 90°
    case 5:
      rotate = 90;
      scaleY = -1;
      break;

    // Rotate right 90°
    case 6:
      rotate = 90;
      break;

    // Flip horizontal and rotate right 90°
    case 7:
      rotate = 90;
      scaleX = -1;
      break;

    // Rotate left 90°
    case 8:
      rotate = -90;
      break;

    default:
  }

  return {
    rotate,
    scaleX,
    scaleY,
  };
}
