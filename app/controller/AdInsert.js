var fN = function () {
    var name = '';
    return {
        set_name: function (p) {
            name = p;
        },
        get_name: function () {
            return name;
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

    uploadPhoto: function (imageURI) {
        var img = Ext.getCmp('adphoto'),
            fileName = (new Date()).getTime() + ".jpg",  // consider an unique id
            ft = new FileTransfer(),
            op = new FileUploadOptions();

        img.setSrc(imageURI);
        op.fileKey = "file";
        op.fileName = fileName;
        op.mimeType = "image/jpeg";
        op.chunkedMode = false;
        op.httpMethod = "POST";

        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/sign',
            scope: this,
            method: 'POST',
            params: {
                "fileName": fileName
            },
            success: function (response, opts) {
                var obj = Ext.decode(response.responseText);
                var params = {
                    "key": fileName,
                    "AWSAccessKeyId": obj.awsKey,
                    "acl": "public-read",
                    "policy": obj.policy,
                    "signature": obj.signature,
                    "Content-Type": "image/jpeg"
                };
                op.params = params;
                function win(r) {
                    if (r.responseCode === 204) {
                        fn.set_name(fileName);
                    } else {
                        fn.set_name("");
                    }
                }

                function fail(error) {
                    alert("Error = " + JSON.stringify(error));
                    fn.set_name("");
                }

                ft.upload(imageURI, encodeURI("http://" + obj.bucket + ".s3.amazonaws.com/"), win, fail, op);
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
                alert('server-side failure with status code ' + response.status);
            }
        });
    },

    phoneGapCamera: function (isCamera) {
        var that = this;
        navigator.camera.getPicture(
            function (imageURI) {
                that.uploadPhoto(imageURI);
            },
            function (message) {
                alert('Failed: ' + message);
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

    ajaxPostAd: function (userId, values) {
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/ad',
            method: 'POST',
            params: {
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
        fn.set_name("");
        Ext.getCmp('insertadform').setMasked(false);
    },

    onAfterPostAdFailure: function (response) {
        Ext.getCmp('insertadform').setMasked(false);
        alert('Error occurred. Please, check your connection');
    },

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