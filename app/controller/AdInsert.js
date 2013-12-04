Ext.define('ShopAfter.controller.AdInsert', {
    extend: 'Ext.app.Controller',
    config: {
        name: '',
        imgUri: '',
        control: {
            '#saveAdForm': {
                tap: 'validateAdForm'
            },
            '#adphoto': {
                tap: 'tabPhoto'
            },
            '#currency': {
                change: 'onCurrencyChange'
            }
        },
        refs: {
            phone: '#phone'
        }
    },

    onCurrencyChange: function (field) {
        var codes = [],
            currency = field.getRecord().data.value;
        codes.IDR = 62;
        codes.MYR = 60;
        codes.PHP = 63;
        codes.SGD = 65;
        codes.VND = 84;
        this.getPhone().setValue(codes[currency]);
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
                this.setName('');
                this.setImgUri('');
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
        this.setName((new Date()).getTime() + ".jpg");  // consider an unique id
        this.setImgUri(img_uri);
        img.setSrc(this.getImgUri());
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
                "fileName": this.getName()
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
        op.fileName = this.getName();
        op.mimeType = "image/jpeg";
        op.chunkedMode = false;
        op.httpMethod = "POST";
        op.params = {
            "key": this.getName(),
            "AWSAccessKeyId": obj.awsKey,
            "acl": "public-read",
            "policy": obj.policy,
            "signature": obj.signature,
            "Content-Type": "image/jpeg"
        };
        function win(r) {
            if (r.responseCode !== 204) {
                this.setName('');
                this.setImgUri('');
            }
        }

        function fail(error) {
            alert("Error = " + JSON.stringify(error));
            this.setName('');
            this.setImgUri('');
        }

        if (this.getImgUri() !== '') {
            ft.upload(this.getImgUri(), encodeURI("http://" + obj.bucket + ".s3.amazonaws.com/"), win, fail, op);
        } else {
            alert('Please, retake/reupload your picture');
        }
    },

    onAfterPostSignFailure: function (response) {
        alert('server-side failure with status code ' + response.status);
    },

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
                image: this.getName(),
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
        this.setName('');
        this.setImgUri('');
        Ext.getCmp('insertadform').setMasked(false);
    },

    onAfterPostAdFailure: function (response) {
        Ext.getCmp('insertadform').setMasked(false);
        alert('Error occurred. Please, check your connection');
    },
    // ----------------------------------

    validateAdForm: function (button, e, options) {
        var that = this,
            errorString = '',
            form = Ext.getCmp('insertadform'),
            model = Ext.create('ShopAfter.model.InsertAd', form.getValues()),
            errors = model.validate();
        if (this.getName() === "") {
            alert('The pictures help you sell better, please upload them now!');
            return false;
        }
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
                    //http://stackoverflow.com/questions/13944940/facebook-javascript-sdk-uncaught-typeerror-cannot-read-property-userid-of-und
                    that.ajaxPostAd(response.authResponse.userID || response.authResponse.userId, form.getValues());
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