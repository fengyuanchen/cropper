(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else {
        factory(jQuery);
    }
})(function ($) {

    "use strict";

    function CropAvatar($element) {
        this.$container = $element;

        this.$avatarView = this.$container.find(".avatar-view");
        this.$avatar = this.$avatarView.find("img");
        this.$avatarModal = this.$container.find("#avatar-modal");
        this.$loading = this.$container.find(".loading");

        this.$avatarForm = this.$avatarModal.find(".avatar-form");
        this.$avatarUpload = this.$avatarForm.find(".avatar-upload");
        this.$avatarSrc = this.$avatarForm.find(".avatar-src");
        this.$avatarData = this.$avatarForm.find(".avatar-data");
        this.$avatarInput = this.$avatarForm.find(".avatar-input");
        this.$avatarSave = this.$avatarForm.find(".avatar-save");

        this.$avatarWrapper = this.$avatarModal.find(".avatar-wrapper");
        this.$avatarPreview = this.$avatarModal.find(".avatar-preview");

        this.init();
        console.log(this);
    }

    CropAvatar.prototype = {
        constructor: CropAvatar,

        support: {
            fileList: !!$("<input type=\"file\">").prop("files"),
            fileReader: !!window.FileReader,
            formData: !!window.FormData
        },

        init: function () {
            this.localPreview = this.support.fileList && this.support.fileReader;

            if (!this.support.formData) {
                this.initIframe();
            }

            this.initTooltip();
            this.initModal();
            this.addListener();
        },

        addListener: function () {
            this.$avatarView.on("click", $.proxy(this.click, this));
            this.$avatarInput.on("change", $.proxy(this.change, this));
            this.$avatarForm.on("submit", $.proxy(this.submit, this));
        },

        removeListener: function () {
        },

        initTooltip: function () {
            this.$avatarView.tooltip({
                placement: "bottom"
            });
        },

        initModal: function () {
            this.$avatarModal.modal("hide");
            this.initPreview();
        },

        initPreview: function () {
            var url = this.$avatar.attr("src");

            this.$avatarPreview.empty().html('<img src="' + url + '">');
        },

        initIframe: function () {
            var iframeName = "avatar-iframe-" + Math.random().toString().replace(".", ""),
                $iframe = $('<iframe name="' + iframeName + '" style="display:none;"></iframe>'),
                _this = this;

            this.$iframe = $iframe;
            this.$avatarForm.attr("target", iframeName).after($iframe);

            this.$iframe.on("load", function () {
                var data,
                    win,
                    doc;

                try {
                    win = this.contentWindow;
                    doc = this.contentDocument;

                    doc = doc ? doc : win.document;
                    data = doc ? doc.body.innerText : null;
                } catch (e) {}

                if (data) {
                    try {
                        data = $.parseJSON(data);
                    } catch (e) {}

                    _this.submitDone(data);
                } else {
                    if (firstLoad) {
                        firstLoad = false;
                    } else {
                        _this.submitFail("Image upload failed!");
                    }
                }

                _this.submitEnd();
            });
        },

        click: function () {
            this.$avatarModal.modal("show");
        },

        change: function () {
            var files,
                file;

            if (this.localPreview) {
                files = this.$avatarInput.prop("files");

                if (files.length > 0) {
                    file = files[0];

                    if (this.isImageFile(file)) {
                        this.read(file);
                    }
                }
            } else {
                file = this.$avatarInput.val();

                if (this.isImageFile(file)) {
                    this.syncUpload();
                }
            }
        },

        submit: function () {
            if (this.support.formData) {
                this.ajaxUpload();
                return false;
            }
        },

        isImageFile: function (file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type);
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file);
            }
        },

        read: function (file) {
            var _this = this,
                fileReader = new FileReader();

            fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = function () {
                _this.url = this.result
                _this.crop();
            };
        },

        crop: function () {
            var _this = this;

            this.$img = $('<img src="' + this.url + '">');
            this.$avatarWrapper.empty().html(this.$img);
            this.startCropper();
        },

        startCropper: function () {
            var _this = this;

            this.$img.cropper({
                aspectRatio: 1,
                preview: this.$avatarPreview.selector,
                done: function (data) {
                    var json = [
                        '{"x1":' + data.x1,
                        '"y1":' + data.y1,
                        '"height":' + data.height,
                        '"width":' + data.width,
                        '"x2":' + data.x2,
                        '"y2":' + data.y2 + "}"
                    ].join();

                    _this.$avatarData.val(json);
                }
            });
        },

        stopCropper: function () {
            this.$img.cropper("disable");
            this.$img.remove();
        },

        ajaxUpload: function () {
            var url = this.$avatarForm.attr("action"),
                data = new FormData(this.$avatarForm[0]),
                _this = this;

            $.ajax(url, {
                type: "post",
                data: data,
                dataType: "json",
                processData: false,
                contentType: false,

                beforeSend: function () {
                    _this.submitStart();
                },

                success: function (data) {
                    _this.submitDone(data);
                },

                error: function () {
                    _this.submitFail("Failed to save the avatar!");
                },

                complete: function () {
                    _this.submitEnd();
                }
            });
        },

        syncUpload: function () {
            this.$avatarSave.click();
        },

        submitStart: function () {
            this.$loading.fadeIn();
        },

        submitDone: function (data) {
            if (data && data.state === 200) {

                if (data.error) {
                    this.alert(data.error);
                    return;
                }

                this.url = data.result;

                if (this.localPreview || this.uploaded) {
                    this.uploaded = false;
                    this.cropDone();
                } else {
                    this.uploaded = true;
                    this.$avatarSrc.val(this.url);
                    this.crop();
                }

                this.$avatarInput.val("");
            } else {
                this.alert("Submit error!");
            }
        },

        submitFail: function () {
            this.alert("Submit error!");
        },

        submitEnd: function () {
            this.$loading.fadeOut();
        },

        cropDone: function () {
            this.$avatarSrc.val("");
            this.$avatarData.val("");
            this.$avatar.attr("src", this.url);
            this.stopCropper();
            this.$avatarModal.modal("hide");
        },

        alert: function (msg) {
            var $alert = [
                '<div class="alert alert-danger avater-alert">',
                    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
                    msg,
                '</div>'
                ].join("");

            this.$avatarUpload.after($alert);
        }
    };

    $(function () {
        var example = new CropAvatar($("#crop-avatar"));
    });
});
