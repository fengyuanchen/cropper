# Crop Avatar

A complete example of Cropper.


## Server Dependencies

- PHP 5.5+


## Browser Support

- Chrome (latest 2)
- Firefox (latest 2)
- Internet Explorer 9+
- Opera (latest 2)
- Safari (latest 2)


## FAQ

### How to debug the example page with browsers?

Take Chrome for example:

1. Open the example page on **Chrome**.
2. Open the **Developer Tools** of the browser.
  1. Choose the **Network** panel from the opened window.
  2. Click the **Clear** button to clear the existent logs.
3. Click avatar to open the cropping modal.
  1. Click the file input to choose an image from your local computer.
  2. Crop the image with the Cropper.
4. Click the **Save** button to upload and crop the image.
5. Check the **Network** panel if you got a `parse error`.
  1. Click the `crop.php` request item from the **Name** column of the panel.
  2. Click the **Preview** panel from the opened window.
  3. Find the error from the response.


### How to do when I got an `Unknown upload error`?

You might upload a huge image, just configure the `upload_max_filesize`, `post_max_size` and `memory_limit` of your `php.ini` file. Or check the **php_error.log** file to find out the problem.
