  // Use the string compressor: Strmin (https://github.com/fengyuanchen/strmin)
  Cropper.TEMPLATE = (function (source, words) {
    words = words.split(',');
    return source.replace(/\d+/g, function (i) {
      return words[i];
    });
  })('<0 6="5-container"><0 6="5-canvas"></0><0 6="5-cropbox"><1 6="5-viewer"></1><1 6="5-8 8-h"></1><1 6="5-8 8-v"></1><1 6="5-face" 3-2="all"></1><1 6="5-7 7-e" 3-2="e"></1><1 6="5-7 7-n" 3-2="n"></1><1 6="5-7 7-w" 3-2="w"></1><1 6="5-7 7-s" 3-2="s"></1><1 6="5-4 4-e" 3-2="e"></1><1 6="5-4 4-n" 3-2="n"></1><1 6="5-4 4-w" 3-2="w"></1><1 6="5-4 4-s" 3-2="s"></1><1 6="5-4 4-ne" 3-2="ne"></1><1 6="5-4 4-nw" 3-2="nw"></1><1 6="5-4 4-sw" 3-2="sw"></1><1 6="5-4 4-se" 3-2="se"></1></0></0>','div,span,directive,data,point,cropper,class,line,dashed');

  /* Template source:
  <div class="cropper-container">
    <div class="cropper-canvas"></div>
    <div class="cropper-cropbox">
      <span class="cropper-viewer"></span>
      <span class="cropper-dashed dashed-h"></span>
      <span class="cropper-dashed dashed-v"></span>
      <span class="cropper-face" data-directive="all"></span>
      <span class="cropper-line line-e" data-directive="e"></span>
      <span class="cropper-line line-n" data-directive="n"></span>
      <span class="cropper-line line-w" data-directive="w"></span>
      <span class="cropper-line line-s" data-directive="s"></span>
      <span class="cropper-point point-e" data-directive="e"></span>
      <span class="cropper-point point-n" data-directive="n"></span>
      <span class="cropper-point point-w" data-directive="w"></span>
      <span class="cropper-point point-s" data-directive="s"></span>
      <span class="cropper-point point-ne" data-directive="ne"></span>
      <span class="cropper-point point-nw" data-directive="nw"></span>
      <span class="cropper-point point-sw" data-directive="sw"></span>
      <span class="cropper-point point-se" data-directive="se"></span>
    </div>
  </div>
  */
