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
        var img = Ext.getCmp('adphoto');
        img.setSrc(imageURI);
        var fileName = "" + (new Date()).getTime() + ".jpg";  // consider an unique id
        var ft = new FileTransfer(),
            op = new FileUploadOptions();
        op.fileKey = "file";
        op.fileName = fileName;
        op.mimeType = "image/jpeg";
        op.chunkedMode = false;
        op.httpMethod = "POST";
        Ext.Ajax.request({
            url: 'http://shopafter.com:3000/sign',
            scope: this,  // need this to be able access the controller scope
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
                var aws_url = encodeURI("http://" + obj.bucket + ".s3.amazonaws.com/");
                ft.upload(imageURI, aws_url, win, fail, op);
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
            },
            failure: function (response, opts) {
                console.log('server-side failure with status code ' + response.status);
                alert('server-side failure with status code ' + response.status);
            }
        });
    },

    phoneGapCamera: function (isCamera) {
        var that = this;
        var sourceType;
        if (isCamera) {
            sourceType = Camera.PictureSourceType.CAMERA;
        } else {
            sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        }
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
                sourceType: sourceType
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

    validateAdForm: function (button, e, options) {
        var errorString = '',
            form = Ext.getCmp('insertadform'),
            fields = form.query('field');
        if (fn.get_name() === "") {
            alert('The pictures help you sell better, please upload them now!');
            return false;
        }
        for (var i = 0; i < fields.length; i++) {
            fields[i].removeCls('invalidField');
        }
        var model = Ext.create('ShopAfter.model.InsertAd', form.getValues());
        var errors = model.validate();
        if (!errors.isValid()) {
            errors.each(function (errorObj) {
                errorString += '* ' + errorObj.getMessage() + '\n\n';
                var f = errorObj.getField();
                var s = Ext.String.format('field[name={0}]', f);
                //FIXME: need validation for category_id
                if (f !== 'image') {
                    form.down(s).addCls('invalidField');
                }
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
                //alert('(view.AdInsert) response = ' + JSON.stringify(response));
                if (response.status === 'connected') {
                    var form = Ext.getCmp('insertadform'),
                        values = form.getValues();
                    Ext.Ajax.on("beforerequest", function () {
                        Ext.getCmp('insertadform').setMasked(true);
                    });
                    Ext.Ajax.on("requestcomplete", function () {
                        Ext.getCmp('insertadform').setMasked(false);
                    });
                    Ext.Ajax.on("requestexception", function () {
                        Ext.getCmp('insertadform').setMasked(false);
                    });
                    Ext.Ajax.request({
                        url: 'http://shopafter.com:3000/ad',
                        scope: this,  //need this to be able access the controller scope
                        method: 'POST',
                        params: {
                            profileId: response.authResponse.userId,
                            image: fn.get_name(),
                            category: values.category,
                            description: values.description,
                            price: values.price,
                            phone: values.phone,
                            latitude: 1.3427427,  // TODO: Geolocation, disabled for now
                            longitude: 103.8479989,
                            currency: values.currency
                        },
                        callback: function (success) {
                            if (success) {
                                alert('Hooray, your ad has been posted successfully! Please go to the "Latest ads" to view your ad!');
                                fn.set_name("");
                            } else {
                                alert('Error occurred. Please, check your connection');
                            }
                        }
                    });
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