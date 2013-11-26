var fN = function () {
    var name = '',
        img_uri = '';
    return {
        set_name: function (p) {
            name = p;
        },
        get_name: function () {
            return name;
        },
        set_img_uri: function (p) {
            img_uri = p;
        },
        get_img_uri: function () {
            return img_uri;
        }
    };
};
var fn = fN();

Ext.define('ShopAfter.controller.AdInsert', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            '#saveAdForm': {
                tap: 'validateAdForm'
            },
            '#adphoto': {
                tap: 'tabPhoto'
            }
        }
    },

    tabPhoto: function () {
        Ext.Msg.show({
            scope: this,
            title: null,
            msg: null,
            buttons: [
                {
                    itemId: 'ok',
                    text: 'Take a picture'
                },
                {
                    itemId: 'cancel',
                    text: 'Browse existing pictures'
                }
            ],
            fn: function (btn) {
                this.phoneGapCamera((btn === 'ok'));
            }
        });
    },

    phoneGapCamera: function (isCamera) {
        var that = this;
        navigator.camera.getPicture(
            function (img_url) {
                that.uploadPhoto(img_url);
            },
            function (message) {
                alert('Failed: ' + message);
                fn.set_name('');
                fn.set_img_uri('');
            },
            {
                quality: 85,
                targetWidth: 300,
                targetHeight: 300,
                destinationType: Camera.DestinationType.FILE_URI,
                encodingType: Camera.EncodingType.JPEG,
                correctOrientation: true,
                sourceType: (isCamera === true) ? Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.PHOTOLIBRARY
            }
        );
    },

    uploadPhoto: function (img_uri) {
        var img = Ext.getCmp('adphoto');
        fn.set_name((new Date()).getTime() + ".jpg");  // consider an unique id
        fn.set_img_uri(img_uri);  // initializing img_uri for later upload to s3
        img.setSrc(fn.get_img_uri());
        this.ajaxPostSign();
    },

    // ----------------------------------
    // POST SIGN
    // ----------------------------------
    ajaxPostSign: function () {
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/sign',
            method: 'POST',
            params: {
                "fileName": fn.get_name()
            },
            scope: this,
            success: this.onAfterPostSignSuccess,
            failure: this.onAfterPostSignFailure
        });
    },

    onAfterPostSignSuccess: function (response) {
        var obj = Ext.decode(response.responseText),
            ft = new FileTransfer(),
            op = new FileUploadOptions();

        op.fileKey = "file";
        op.fileName = fn.get_name();
        op.mimeType = "image/jpeg";
        op.chunkedMode = false;
        op.httpMethod = "POST";
        var params = {
            "key": fn.get_name(),
            "AWSAccessKeyId": obj.awsKey,
            "acl": "public-read",
            "policy": obj.policy,
            "signature": obj.signature,
            "Content-Type": "image/jpeg"
        };
        op.params = params;
        function win(r) {
            if (r.responseCode !== 204) {
                fn.set_name('');
                fn.set_img_uri('');
            }
        }

        function fail(error) {
            alert("Error = " + JSON.stringify(error));
            fn.set_name('');
            fn.set_img_uri('');
        }

        if (fn.get_img_uri() !== '') {
            ft.upload(fn.get_img_uri(), encodeURI("http://" + obj.bucket + ".s3.amazonaws.com/"), win, fail, op);
        } else {
            alert('Please, retake/reupload your picture');
        }
    },

    onAfterPostSignFailure: function (response) {
        alert('server-side failure with status code ' + response.status);
    },
    // ----------------------------------

    // ----------------------------------
    // POST AD
    // ----------------------------------
    ajaxPostAd: function (userId, values) {
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/ad',
            method: 'POST',
            params: {
                title: values.title,
                profileId: userId,
                image: fn.get_name(),
                category: values.category,
                description: values.description,
                price: values.price,
                phone: values.phone,
                latitude: 1.3427427,  // TODO: Geolocation, disabled for now
                longitude: 103.8479989,
                currency: values.currency
            },
            scope: this,
            success: this.onAfterPostAdSuccess,
            failure: this.onAfterPostAdFailure
        });
    },

    onAfterPostAdSuccess: function (response) {
        alert('Hooray, your ad has been posted successfully! Please go to the "Latest ads" to view your ad!');
        fn.set_name('');
        fn.set_img_uri('');
        Ext.getCmp('insertadform').setMasked(false);
    },

    onAfterPostAdFailure: function (response) {
        Ext.getCmp('insertadform').setMasked(false);
        alert('Error occurred. Please, check your connection');
    },
    // ----------------------------------

    validateAdForm: function (button, e, options) {
        var that = this;
        var errorString = '',
            form = Ext.getCmp('insertadform');
        if (fn.get_name() === "") {
            alert('The pictures help you sell better, please upload them now!');
            return false;
        }
        var model = Ext.create('ShopAfter.model.InsertAd', form.getValues());
        var errors = model.validate();
        if (!errors.isValid()) {
            errors.each(function (errorObj) {
                errorString += '* ' + errorObj.getMessage() + '\n\n';
            });
            alert(errorString);
            return false;
        }
        Ext.getCmp('insertadform').setMasked({
            xtype: 'loadmask',
            message: 'Posting your ad ...'
        });
        FB.login(
            function (response) {
                if (response.status === 'connected') {
                    that.ajaxPostAd(response.authResponse.userId, form.getValues());
                } else {
                    alert("Sorry, please connect to Facebook account to post your ads." +
                        "Don't worry, we won't share anything without your okay. Promise!");
                }
            },
            { scope: "email" }
        );
        Ext.getCmp('insertadform').setMasked(false);
        return true;
    }
});