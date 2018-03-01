describe('cropper', () => {
  const createImage = () => {
    const container = document.createElement('div');
    const image = document.createElement('img');

    image.src = '/base/docs/images/picture.jpg';
    container.appendChild(image);
    document.body.appendChild(container);

    return image;
  };

  it('should register as a plugin correctly', () => {
    expect($.fn.cropper).to.be.a('function');
    expect($.fn.cropper.Constructor).to.be.a('function');
    expect($.fn.cropper.noConflict).to.be.a('function');
    expect($.fn.cropper.setDefaults).to.be.a('function');
  });

  it('should remove data after destroyed', () => {
    const $image = $(createImage());

    $image.cropper();
    expect($image.data('cropper')).to.be.an.instanceof($.fn.cropper.Constructor);
    $image.cropper('destroy');
    expect($image.data('cropper')).to.be.undefined;
  });

  it('should apply the given option', (done) => {
    $(createImage()).cropper({
      aspectRatio: 1,

      ready() {
        const $this = $(this);
        const cropper = $this.data('cropper');
        const cropBoxData = $this.cropper('getCropBoxData');

        expect(cropper.options.aspectRatio).to.equal(1);
        expect(cropBoxData.width).to.equal(cropBoxData.height);
        done();
      },
    });
  });

  it('should execute the given method', (done) => {
    $(createImage()).cropper({
      ready() {
        const $this = $(this);
        const cropper = $this.data('cropper');

        expect(cropper.cropped).to.be.true;
        $this.cropper('clear');
        expect(cropper.cropped).to.be.false;
        done();
      },
    });
  });

  it('should trigger the binding event', (done) => {
    $(createImage()).one('ready', (event) => {
      expect(event.type).to.equal('ready');
      done();
    }).cropper();
  });
});
