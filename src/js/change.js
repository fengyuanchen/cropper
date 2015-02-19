  prototype.change = function () {
    var directive = this.directive,
        image = this.image,
        container = this.container,
        maxWidth = container.width,
        maxHeight = container.height,
        cropBox = this.cropBox,
        width = cropBox.width,
        height = cropBox.height,
        left = cropBox.left,
        top = cropBox.top,
        right = left + width,
        bottom = top + height,
        renderable = true,
        aspectRatio = this.options.aspectRatio,
        range = {
          x: this.endX - this.startX,
          y: this.endY - this.startY
        },
        offset;

    if (aspectRatio) {
      range.X = range.y * aspectRatio;
      range.Y = range.x / aspectRatio;
    }

    switch (directive) {
      // Move cropBox
      case 'all':
        left += range.x;
        top += range.y;
        break;

      // Resize cropBox
      case 'e':
        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= 0 || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top -= range.Y / 2;
        }

        if (width < 0) {
          directive = 'w';
          width = 0;
        }

        break;

      case 'n':
        if (range.y <= 0 && (top <= 0 || aspectRatio && (left <= 0 || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height -= range.y;
        top += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left += range.X / 2;
        }

        if (height < 0) {
          directive = 's';
          height = 0;
        }

        break;

      case 'w':
        if (range.x <= 0 && (left <= 0 || aspectRatio && (top <= 0 || bottom >= maxHeight))) {
          renderable = false;
          break;
        }

        width -= range.x;
        left += range.x;

        if (aspectRatio) {
          height = width / aspectRatio;
          top += range.Y / 2;
        }

        if (width < 0) {
          directive = 'e';
          width = 0;
        }

        break;

      case 's':
        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= 0 || right >= maxWidth))) {
          renderable = false;
          break;
        }

        height += range.y;

        if (aspectRatio) {
          width = height * aspectRatio;
          left -= range.X / 2;
        }

        if (height < 0) {
          directive = 'n';
          height = 0;
        }

        break;

      case 'ne':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= 0 || right >= maxWidth)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y <= 0 && top <= 0) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y <= 0) {
            if (top > 0) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          directive = 'sw';
          height = 0;
          width = 0;
        } else if (width < 0) {
          directive = 'nw';
          width = 0;
        } else if (height < 0) {
          directive = 'se';
          height = 0;
        }

        break;

      case 'nw':
        if (aspectRatio) {
          if (range.y <= 0 && (top <= 0 || left <= 0)) {
            renderable = false;
            break;
          }

          height -= range.y;
          top += range.y;
          width = height * aspectRatio;
          left += range.X;
        } else {
          if (range.x <= 0) {
            if (left > 0) {
              width -= range.x;
              left += range.x;
            } else if (range.y <= 0 && top <= 0) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y <= 0) {
            if (top > 0) {
              height -= range.y;
              top += range.y;
            }
          } else {
            height -= range.y;
            top += range.y;
          }
        }

        if (width < 0 && height < 0) {
          directive = 'se';
          height = 0;
          width = 0;
        } else if (width < 0) {
          directive = 'ne';
          width = 0;
        } else if (height < 0) {
          directive = 'sw';
          height = 0;
        }

        break;

      case 'sw':
        if (aspectRatio) {
          if (range.x <= 0 && (left <= 0 || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width -= range.x;
          left += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x <= 0) {
            if (left > 0) {
              width -= range.x;
              left += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width -= range.x;
            left += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          directive = 'ne';
          height = 0;
          width = 0;
        } else if (width < 0) {
          directive = 'se';
          width = 0;
        } else if (height < 0) {
          directive = 'nw';
          height = 0;
        }

        break;

      case 'se':
        if (aspectRatio) {
          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
            renderable = false;
            break;
          }

          width += range.x;
          height = width / aspectRatio;
        } else {
          if (range.x >= 0) {
            if (right < maxWidth) {
              width += range.x;
            } else if (range.y >= 0 && bottom >= maxHeight) {
              renderable = false;
            }
          } else {
            width += range.x;
          }

          if (range.y >= 0) {
            if (bottom < maxHeight) {
              height += range.y;
            }
          } else {
            height += range.y;
          }
        }

        if (width < 0 && height < 0) {
          directive = 'nw';
          height = 0;
          width = 0;
        } else if (width < 0) {
          directive = 'sw';
          width = 0;
        } else if (height < 0) {
          directive = 'ne';
          height = 0;
        }

        break;

      // Move image
      case 'move':
        image.left += range.x;
        image.top += range.y;
        this.renderImage(true);
        renderable = false;
        break;

      // Scale image
      case 'zoom':
        this.zoom(function (x, y, x1, y1, x2, y2) {
          return (sqrt(x2 * x2 + y2 * y2) - sqrt(x1 * x1 + y1 * y1)) / sqrt(x * x + y * y);
        }(
          image.width,
          image.height,
          abs(this.startX - this.startX2),
          abs(this.startY - this.startY2),
          abs(this.endX - this.endX2),
          abs(this.endY - this.endY2)
        ));

        this.endX2 = this.startX2;
        this.endY2 = this.startY2;
        renderable = false;
        break;

      // Crop image
      case 'crop':
        if (range.x && range.y) {
          offset = this.$cropper.offset();
          left = this.startX - offset.left;
          top = this.startY - offset.top;
          width = cropBox.minWidth;
          height = cropBox.minHeight;

          if (range.x > 0) {
            if (range.y > 0) {
              directive = 'se';
            } else {
              directive = 'ne';
              top -= height;
            }
          } else {
            if (range.y > 0) {
              directive = 'sw';
              left -= width;
            } else {
              directive = 'nw';
              left -= width;
              top -= height;
            }
          }

          // Show the cropBox if is hidden
          if (!this.cropped) {
            this.cropped = true;
            this.$cropBox.removeClass(CLASS_HIDDEN);
          }
        }

        break;

      // No default
    }

    if (renderable) {
      cropBox.width = width;
      cropBox.height = height;
      cropBox.left = left;
      cropBox.top = top;
      this.directive = directive;

      this.renderCropBox();
    }

    // Override
    this.startX = this.endX;
    this.startY = this.endY;
  };
